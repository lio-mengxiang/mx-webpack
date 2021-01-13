const { SyncHook } = require('tapable');
const { isObject, isArray } = require('./utils');
const fs = require('fs');
const path = require('path');
const esprima = require('esprima');
const escodegen = require('escodegen');
const estraverse = require('estraverse');
const ejs = require('ejs');
class Compiler {
  constructor(options) {
    if (!isObject(options)) throw TypeError('options应该传对象');
    this.options = options;
    this.hooks = {
      entryOption: new SyncHook(['config']),
      afterPlugins: new SyncHook(['conifg']),
      run: new SyncHook(['config']),
      compile: new SyncHook(['conifg']),
      afterCompile: new SyncHook(['conifg']),
      emit: new SyncHook(['conifg']),
      done: new SyncHook(['conifg']),
    }
    let plugins = options.plugins;
    plugins.forEach(plugin => {
      plugin.apply(this)
    })
    // 触发插件加载完成事件
    this.hooks.afterPlugins.call(this);
  }
  // 找到入口文件编译
  run() {
    this.hooks.run.call(this);
    let { entry, output: { path: dist, filename }, resolveLoaders: { modules: loaderPath }, module: { rules } } = this.options;
    let root = process.cwd();
    let entryPath = path.join(root, entry);
    let modules = {};
    let entryId;
    this.hooks.compile.call(this);
    parseModule(entryPath, true);
    this.hooks.afterCompile.call(this);
    const template = `
      (function(modules){
        function require(moduleId){
          var module = {
            exports: {}
          };
          modules[moduleId].call(module, module.exports, module, require);
          return module.exports;
        }
        return require("<%-entryId%>");
      })({
        <% for(let moduleId2 in modules){ %>
          "<%-moduleId2%>": (
            function(exports, module, require){
              eval(\`<%-modules[moduleId2]%>\`);
            }
          ),
          <%}%>
      })
    `
    let bundle = ejs.compile(template, 'utf8')({
      modules, entryId
    });
    this.hooks.emit.call(this);
    try {
      fs.accessSync(dist, fs.constants.F_OK)

    } catch{
      fs.mkdirSync(dist, { recursive: true })
    }
    fs.writeFileSync(path.join(dist, filename), bundle)
    this.hooks.done.call(this);

    function parseModule(modulePath, isEntry) {
      // 取得入口文件的文件内容
      let source = fs.readFileSync(modulePath, 'utf8');
      for (let i = 0; i < rules.length; i++) {

        let rule = rules[i];
        if (rule.test.test(modulePath)) {
          let loaders = rule.use || rule.loader;
          console.log(isArray(loaders),loaders);
          if(isArray(loaders)){
            for(let j = loaders.length - 1; j >= 0; j--){
              let loader = loaders[j];
              loader = require(path.join(root, loaderPath, loader));
              console.log('loader: ', loader);
              source = loader(source);
            }
          }
        }
      }
      let parentPath = path.relative(root, modulePath);
      // console.log('source: ', source);

      let result = parse(source, path.dirname(parentPath));

      modules['./' + parentPath] = result.source;
      if (isEntry) entryId = './' + parentPath;
      let requires = result.requires;
      if (requires && requires.length > 0) {
        requires.forEach(require => parseModule(path.join(root, require)))
      }
    }

    function parse(source, parentPath) {
      let ast = esprima.parse(source); // 生成抽象语法树
      // 遍历抽象语法树：1.找到模块依赖 2.替换掉老的加载路径
      let requires = [];
      estraverse.replace(ast, {
        enter(node) {
          if (node.type === 'CallExpression' && node.callee.name === 'require') {
            let name = node.arguments[0].value; // 原模块路径
            name += (name.lastIndexOf('.') > 0 ? '' : '.js');
            let moduleId = './' + path.join(parentPath, name);
            requires.push(moduleId);
            node.arguments = [{ type: 'Literal', value: moduleId }];
            return node;
          }
        }
      })
      source = escodegen.generate(ast);
      return { requires, source }
    }
  }

  init(options) {
    initPlugins(options.plugins)
  }

  initPlugins(plugins) {

  }
}

module.exports = Compiler;
