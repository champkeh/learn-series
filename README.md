# learn-bundler
学习前端打包工具

### `package.json`文件各个字段的说明

- `main`：该字段的文件会被作为CJS模块，通过`require`加载
- `module`：该字段的文件会被作为ES模块，通过`import`加载
- `browser`：该字段的文件会被作为UMD模块，适用于所有环境
