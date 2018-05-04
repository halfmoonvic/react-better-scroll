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
      scrollbarFade: true, // false 让滚动条一直显示
      pullDownRefresh: true,
      pullDownRefreshThreshold: 90,
      pullDownRefreshStop: 40,
      startY: 0,
      items: []
    };
    this.clickItem = this.clickItem.bind(this);
    this.onPullingDown = this.onPullingDown.bind(this);
  }
  get scrollbarObj() {
    return this.state.scrollbar ? { fade: this.state.scrollbarFade } : false;
  }
  get pullDownRefreshObj() {
    return this.state.pullDownRefresh
      ? {
          threshold: parseInt(this.state.pullDownRefreshThreshold),
          stop: parseInt(this.state.pullDownRefreshStop)
        }
      : false;
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
  onPullingDown() {
    // 模拟更新数据
    console.log('pulling down and load data');
    setTimeout(() => {
      if (this._isDestroyed) {
        return;
      }
      // if (Math.random() > 0.5) {
        let temp = this.state.items;
        temp.unshift('这是新数据' + +new Date());
        // 如果有新数据
        this.setState({
          items: temp
        });
      // } else {
        // 如果没有新数据
        // this.refs.scroll.forceUpdate();
      // }
    }, 2000);
  }
  render() {
    console.log('vertical-scroll render...')
    return (
      <Page title="vertical-scroll 普通 scroll组件">
        <Scroll
          data={this.state.items}
          scrollbar={this.scrollbarObj}
          clickItem={this.clickItem}
          pullDownRefresh={this.pullDownRefreshObj}
          pullingDown={this.onPullingDown}
          startY={parseInt(this.state.startY)}
        />
      </Page>
    );
  }
}

export default BScroll;
