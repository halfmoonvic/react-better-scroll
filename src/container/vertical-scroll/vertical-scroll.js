/**** React应用依赖组件 ****/
// core
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
/******* 第三方 组件库 *****/
/**** 本地公用变量 公用函数 **/
/******* 本地 公用组件 *****/
import Scroll from 'component/scroll/scroll';
import Page from 'component/page/page';
/**** 当前组件的 子组件等 ***/

@withRouter
class BScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollbar: true, // 是否显示滚动条
      scrollbarFade: false // false 让滚动条一直显示
    };
    this.clickItem = this.clickItem.bind(this);
  }
  get scrollbarObj() {
    return this.state.scrollbar ? { fade: this.state.scrollbarFade } : false;
  }
  componentWillMount() {
    let i = 1;
    let data = [];
    while (i < 15) {
      data.push(`我是第${i}行`);
      i++;
    }
    this.setState({ items: data });
  }
  clickItem(item) {
    console.log(item);
    // this.props.history.goBack()
  }
  render() {
    return (
      <Page title="vertical-scroll 普通 scroll组件">
        <Scroll
          data={this.state.items}
          scrollbar={this.scrollbarObj}
          diyClick={this.clickItem}
        />
      </Page>
    );
  }
}

export default BScroll;
