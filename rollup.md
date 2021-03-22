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
todo

### finalisers
todo
