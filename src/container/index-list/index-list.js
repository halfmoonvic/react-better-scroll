/**** React应用依赖组件 ****/
// core
import './index-list.styl';
import React, { Component } from 'react';
/******* 第三方 组件库 *****/
/**** 本地公用变量 公用函数 **/
/******* 本地 公用组件 *****/
import Page from 'component/page/page';
import IndexList from 'component/index-list/index-list';
/**** 当前组件的 子组件等 ***/

const cityData = require('../../data/index-list.json');

class IndexListWrapper extends Component {
  render() {
    return (
      <Page title={'索引列表'}>
        <div className="split" />
        <div className="view-wrapper">
          <div className="index-list-wrapper">
            <IndexList ref="lal" data={cityData} />
          </div>
        </div>
      </Page>
    );
  }
}

export default IndexListWrapper;
