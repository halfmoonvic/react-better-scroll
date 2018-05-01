/**** React应用依赖组件 ****/
// core
import React, { Component } from 'react'
/******* 第三方 组件库 *****/
/**** 本地公用变量 公用函数 **/
/******* 本地 公用组件 *****/
import Page from 'component/page/page';
/**** 当前组件的 子组件等 ***/

class IndexList extends Component {
  render() {
    return (
      <Page
        desc={<div>desc</div>}
      >IndexList</Page>
    )
  }
}

export default IndexList
