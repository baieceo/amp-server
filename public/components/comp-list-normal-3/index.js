(function moduleDefinition(root, factory) {
  const $ = 'ComponentA'; // 自定义模块名

  if ('object' === typeof exports && 'object' === typeof module) {
    module.exports[$] = factory(); // 兼容 CommonJS
  } else if ('function' === typeof define && (define.amd || define.cmd)) {
    define(factory); // 兼容 AMD/CMD
  } else if ('object' === typeof exports) {
    exports[$] = factory();
  } else if (root) {
    root[$] = factory();
  } else if (window) {
    window[$] = factory();
  }
})(this, (() => {
  'use strict';

  class App extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return <div>App123</div>
    }
  }

  return App // 要导出的模块示例
}));