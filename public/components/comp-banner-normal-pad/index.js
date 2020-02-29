/*
 * @Author: your name
 * @Date: 2020-02-23 19:58:30
 * @LastEditTime: 2020-02-29 14:42:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \amp-server\public\components\comp-list-normal-3\index.js
 */
(function moduleDefinition(root, factory) {
  const $ = 'CompBannerNormalPad'; // 自定义模块名

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
      return (
        <div className="amp-component" uid={this.props.uid}>
          <div className="amp-component-inner">comp-banner-normal-pad</div>
        </div>
      );
    }
  }

  return App;
}));