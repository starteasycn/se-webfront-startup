### 蜂巢系统前端框架 ###
采用react + redux + react-route + saga 技术

## 项目包含以下功能

- [x] [Webpack](https://webpack.github.io)
- [x] [React](https://facebook.github.io/react/)
- [x] [Redux](https://github.com/reactjs/redux)
- [x] [Babel](https://babeljs.io/)
- [x] [Autoprefixer](https://github.com/postcss/autoprefixer)
- [x] [PostCSS](https://github.com/postcss/postcss)
- [x] [CSS modules](https://github.com/outpunk/postcss-modules)
- [x] [Rucksack](http://simplaio.github.io/rucksack/docs)
- [x] [React Router Redux](https://github.com/reactjs/react-router-redux)
- [x] [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)

模板项目github地址:
TJ大神的项目(node生态圈中 express 和 koa 的作者)
[react-boilerplate](https://github.com/tj/frontend-boilerplate)

我在该模板的功能上增加了 saga 用来处理异步数据流,增加了 devTools 和 logger 中间件



## 使用方法 ##
1.克隆仓库到本地
```shell
git clone http://wushang@git.qtonecloud.cn/scm/dap/dap-honey.git
```

2.安装项目依赖(需要切换到/work目录下)
__强烈建议使用 cnpm 来安装项目依赖__
```shell
cd work
cnpm install
```

3.启动程序   
会占用本地3000端口,所以请确保3000端口没有被占用,或者修改服务端口
```shell
npm start
```

#### 修改服务端口方法 ####
假设你需要将程序端口从 3000 改为 3030

    1.打开/work/package.json
    
    2.找到 scripts 中的 start 项
    
    3.将 3000 改为 3030

## 其他 ##

以下是学习 redux、 saga 的部分资料。另外,在使用 Redux 时,可能需要额外学习 __面向过程__ 的知识,才能够写出高可用的代码
    
- [compose redux sagas](https://zhuanlan.zhihu.com/p/21399936)
- [Handling async in Redux with Sagas](http://wecodetheweb.com/2016/01/23/handling-async-in-redux-with-sagas/)
- [关于React Route Redux的分模块](http://www.jianshu.com/p/0ee8711acb9f)
- [掌控 redux 异步](https://zhuanlan.zhihu.com/p/21398212)
- [React+Redux系列教程](https://github.com/lewis617/react-redux-tutorial)
- [函数式编程](https://zhuanlan.zhihu.com/p/20824527?refer=FrontendMagazine)
- [精益 React 学习指南 （Lean React）序](https://segmentfault.com/a/1190000005136764)