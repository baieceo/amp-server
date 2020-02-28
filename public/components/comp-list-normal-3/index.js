/*
 * @Author: your name
 * @Date: 2020-02-23 19:58:30
 * @LastEditTime: 2020-02-28 22:38:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \amp-server\public\components\comp-list-normal-3\index.js
 */
(function moduleDefinition(root, factory) {
  const $ = 'CompListNormal3'; // 自定义模块名

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

  class CompListNormal3 extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div className="amp-component">
          <div className="amp-component-inner">comp-list-normal-3</div>
        </div>
      );
    }
  }

  return CompListNormal3;
}));