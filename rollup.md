# Rollup 源码分析


## Rollup基本数据结构

### Bundle
是rollup进行构建的一个基本单位，调用`build`方法时，开始对入口模块进行解析，并分析入口模块中import的所有的name，然后从这些import的依赖中查找对应name的定义，并把定义这些name的ast节点保存到一个数组中。这样当所有这些被import的name对应的ast节点都搜集完毕之后，只需要将这些ast节点和入口模块中的节点组装成单个ast树，再根据这棵树就可以生成最后的bundle了，这样就把入口模块所有的依赖打包成单个文件了。


### Module
对应单个模块的数据结构，在构造Module的实例时，会对该模块进行解析并分析该模块的imports/exports信息。同时提供了一个`define`方法，用来在该模块中查找对应name的定义节点；如果该name不是在该模块中定义的，则会继续向对应依赖中查找。

### ExternalModule
todo

### Scope
js的作用域结构，通过`parent`字段进行级联，组成一个作用域链。结构如下：
```text
{
    parent: Scope | null,
    depth: number,
    names: [string],
    isBlockScope: boolean
}
```

**关于Scope需要注意的是：**  
在向一个 Scope 添加 name 的时候，如果该作用域是一个块作用域，也就是说，该作用域的`isBlockScope`属性的值是`true`，那么，当添加的`name`是一个`FunctionDeclaration`，或者是一个通过`var`声明的`VariableDeclaration`的时候，由于变量提升的原因，不能将该 name 添加在该作用域，而是需要调用父作用域的添加逻辑。如果父作用域仍然是块作用域，则需要继续调用父作用域的添加逻辑。

同时，Scope 结构也会提供一个搜索函数`findDefiningScope`，用来查找某个 name 是在哪个作用域中定义的。(会从当前作用域开始，依次向父级作用域进行搜索)


## 重要逻辑分析

### walk.js
`walk`函数用于遍历 ast 节点树，内部通过`visit`进行递归调用(深度优先)，通过两个全局标志变量`shouldSkip`和`shouldAbort`进行辅助，来决定是否跳过某些节点或退出整个遍历。

**这两个变量的置位时机：**  
- `shouldSkip`: 在开始遍历一个新节点之前会自动重置为`false`，可以在`enter`方法内部调用`this.skip()`将该变量置为`true`，这样就可以跳过该(子)节点树的遍历
- `shouldAbort`: 该变量只有在调用`walk`时才会重置为`false`，一旦在遍历过程中被设置为`true`，则只能中断本次遍历，没有办法进行恢复。

**注意：**
由于`estree`规范的存在，我们知道每种类型的节点的结构是固定的，也就是说，只要知道了一个节点的`type`，就可以知道该节点有哪些`properties`，因此我们可以把这个信息进行缓存来加速遍历性能，方法就是内部的`childKeys`容器，该容器的属性是节点类型，值就是该节点类型里面所有以对象类型的值所对应的属性组成的数组。
```
// childKeys 结构:
{
    type: [key: string]
}
```

比如，`FunctionExpression`节点的结构如下：
```
{
    type: 'FunctionExpression',
    id: Identifier | null,
    params: [ Pattern ],
    body: FunctionBody
}
```
那么，该类节点在`childKeys`容器中的信息就是：
```js
{
    FunctionExpression: ['id', 'params', 'body']
}
```

### analysis.js
`analysis`函数用于对 ast 进行分析，主要目的有2个(v0.3)：
- 处理代码的作用域，生成完整的作用域信息
- 找出语句都有哪些顶层依赖项，以及可能修改哪些标识符

下面说说是如何生成一个完整的作用域信息的：  
`analysis`函数会遍历顶层语句，给每条语句(顶层语句)对应的节点添加一些私有属性，如下：
```js
Object.defineProperties( statement, {
    _defines:          { value: {} },
    _modifies:         { value: {} },
    _dependsOn:        { value: {} },
    _included:         { value: false, writable: true },
    _module:           { value: module },
    _source:           { value: magicString.snip( statement.start, statement.end ) },
    _margin:           { value: [ 0, 0 ] },
    _leadingComments:  { value: [] },
    _trailingComment:  { value: null, writable: true },
});
```

`_leadingComments`和`_trailingComment`比较好理解，就是当前语句的前导注释和尾随注释，其中，尾随注释只能有1个，比如下面这样的：
```js
const a = b; // this is a trailing comment

function foo() {
    console.log(42);
} /* this is also a trailing comment */
```
前导注释可以有多个，比如这样：
```js
// this is a leading comment
// and this is another leading comment
/* me too */
const a = b;
```

注释处理完了，就开始处理`margin`，这个概念类似于`CSS`中盒子之间的`margin`，就是语句之间的一个空白。但是这里有意思的是，这个属性是一个二元组，也就是上面看到的`[0, 0]`，这个二元组的第一个分量保存该语句与前一条语句的`margin`值，第二个分量保存该语句与后一条语句的`margin`值。可以理解成`CSS`中的`margin-top`和`margin-bottom`。

接下来，就开始对每一条语句(顶层语句)进行一个深度遍历(采用`walk`函数)，该过程的目的是为了解析出完整的作用域链。

其中，`FunctionExpression/FunctionDeclaration/ArrowFunctionExpression`会生成一个函数作用域

> 这里有一个点需要注意：  
> 如果该节点是一个`FunctionExpression`，并且该函数表达式有一个name，那么这个 name 也会被添加到这个函数新创建的作用域里面，与参数名没有区别。这就相当于是这个新创建的作用域定义了该函数对象，有点类似于先鸡后蛋还是先蛋后鸡的味道。
> ```js
> const foo = function bar(a, b) {};
> ```
> 上面这个函数表达式所创建的作用域里面，包含3个name的定义：`['a', 'b', 'bar']`

`BlockStatement`创建一个块作用域，`CatchClause`也创建一个块作用域，但它比`BlockStatement`创建的作用域多了一个参数，也就是`catch(e)`里面的`e`。

所有这些新创建的作用域都会保存在对应的节点上面(私有属性`_scope`)。

而那些声明语句，比如`VariableDeclaration/FunctionDeclaration/ClassDeclaration`，则把它们对应的 name 添加到它们所在的那个作用域里面。
如果这个作用域是顶层作用域，则该 name 也会被保存到对应的顶层语句上面(私有属性`_defines`)，表示该 name 是由该语句定义的。

到此为止，对顶层语句的第一遍遍历就结束了，我们的结果就是解析出了完整的作用域信息，并保存在对应的节点上面。

下面开始进行第二遍遍历。

第二遍遍历的目的是什么呢？
我们在上面也已经说了，是 **找出语句都有哪些顶层依赖项，以及可能修改哪些依赖项**，那如何理解这句话呢？

在对节点进行深度遍历的时候，如果遇到`import`语句，则跳过该语句；如果该节点上面有我们之前(第一遍遍历时)绑定的作用域信息(`_scope`属性)，则把该作用域提取出来，然后依次调用`checkForReads`和`checkForWrites`这两个函数。

那我们就来分析下这两个函数是干嘛的。
先说`checkForReads`，代码如下：
```js
function checkForReads ( node, parent ) {
    if ( node.type === 'Identifier' ) {
        // disregard the `bar` in `foo.bar` - these appear as Identifier nodes
        if ( parent.type === 'MemberExpression' && node !== parent.object ) {
            return;
        }

        // disregard the `bar` in { bar: foo }
        if ( parent.type === 'Property' && node !== parent.value ) {
            return;
        }

        const definingScope = scope.findDefiningScope( node.name );

        if ( ( !definingScope || definingScope.depth === 0 ) && !statement._defines[ node.name ] ) {
            statement._dependsOn[ node.name ] = true;
        }
    }
}
```
这个函数的作用就是，如果一个标识符的定义是在顶层或全局作用域中，但是并不是由当前的顶层语句所定义的，就表示这个标识符是一个该顶层语句的依赖项，则将该标识符保存在对应顶层语句所在节点的`_dependsOn`属性中。

举个例子：
```js
const a = 1;

function foo() {
    console.log(a);
}
```
上面这段代码中有2条顶层语句，分别是`VariableDeclaration`和`FunctionDeclaration`。其中，标识符`a`是由第一条语句定义的，并且定义在顶层作用域(`depth`属性为0)中。

在对第二条语句(`FunctionDeclaration`)进行深度遍历时，会出现出现3个标识符符合`checkForReads`的条件检查：`foo`、`console`和`a`。而`foo`是由该顶层语句本身定义的，会出现在`statement._defines`中，所以只剩下`console`和`a`这两个标识符。也就是说，我们的第二条顶层语句依赖于这两个标识符，所以会把这两个标识符保存到这个顶层语句的`_dependsOn`属性中，以便后续使用。

到此，我们就已经清楚了这个`checkForReads`函数的目的了，就是用来搜集顶层语句所依赖的标识符，并把这些依赖保存到`_dependsOn`属性中。取一个时髦的名词就叫**依赖搜集**。

下面分析`checkForWrites`函数：
```js
function checkForWrites ( node ) {
    function addNode ( node, disallowImportReassignments ) {
        while ( node.type === 'MemberExpression' ) {
            node = node.object;
        }

        // disallow assignments/updates to imported bindings and namespaces
        if ( disallowImportReassignments && has( module.imports, node.name ) && !scope.contains( node.name ) ) {
            const err = new Error( `Illegal reassignment to import '${node.name}'` );
            err.file = module.path;
            err.loc = getLocation( module.code.toString(), node.start );
            throw err;
        }

        if ( node.type !== 'Identifier' ) {
            return;
        }

        statement._modifies[ node.name ] = true;
    }

    if ( node.type === 'AssignmentExpression' ) {
        addNode( node.left, true );
    }

    else if ( node.type === 'UpdateExpression' ) {
        addNode( node.argument, true );
    }

    else if ( node.type === 'CallExpression' ) {
        node.arguments.forEach( arg => addNode( arg, false ) );
    }

    // TODO UpdateExpressions, method calls?
}
```
可以看到，当遇到`AssignmentExpression`、`UpdateExpression`以及`CallExpression`节点时，都会调用`addNote`函数，我们就来分析下这个`addNote`函数的代码。

首先，如果传递进来的节点参数是一个成员访问表达式，则将该参数替换成该表达式的最左边的那个标识符。然后根据第二个开关参数来决定是否进行严格的代码审查(也就是不允许对`import`的标识符进行赋值和更新)，然后只过滤出标识符节点，这样就找到了所有可能会被修改的标识符。把这些标识符保存到对应顶层语句所在节点的`_modifies`属性中。

这就是`checkForWrites`函数的目的，我们总结一下：
- `checkForReads` 搜集各个顶层语句所依赖的标识符，并保存在这些语句所在节点的`_dependsOn`属性中。
- `checkForWrites` 搜集各个顶层语句可能会修改的标识符，并保存在这些语句所在节点的`_modifies`属性中。

> 注意：这两类标识符并不是互斥的，比如下面这段代码：
> ```js
> const a = 1;
> 
> function foo() {
>   console.log(a);
>   a = 2;
>   console.log(a);
> }
> ```
> 第二条语句依赖标识符`a`，但同时也会修改该标识符。因此，标识符`a`会同时出现在该语句的`_dependsOn`属性和`_modifies`属性中。


### finalisers
todo
