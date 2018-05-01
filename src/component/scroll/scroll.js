/**** React应用依赖组件 ****/
// core
import './scroll.styl';
import React, { Component } from 'react';
import propTypes from 'prop-types';
/******* 第三方 组件库 *****/
import BScroll from 'better-scroll';
/**** 本地公用变量 公用函数 **/
import { getRect } from '@/common/js/dom';
/******* 本地 公用组件 *****/
/**** 当前组件的 子组件等 ***/

const COMPONENT_NAME = 'scroll';
const DIRECTION_H = 'horizontal';
const DIRECTION_V = 'vertical';

class Scroll extends Component {
  static defaultProps = {
    data: [],
    probeType: 1,
    click: true,
    listenScroll: false,
    listenBeforeScroll: false,
    direction: DIRECTION_V,
    scrollbar: false,
    pullDownRefresh: false,
    pullUpLoad: false,
    startY: 0,
    refreshDelay: 20,
    freeScroll: false,
    mouseWheel: false,
    bounce: true
  };
  static propTypes = {
    data: propTypes.array,
    probeType: propTypes.number,
    click: propTypes.bool,
    listenScroll: propTypes.bool,
    listenBeforeScroll: propTypes.bool,
    direction: propTypes.string,
    // scrollbar: propTypes.null,
    // pullDownRefresh: propTypes.null,
    // pullUpLoad: propTypes.null,

    // scrollbar: () => null,
    // pullDownRefresh:  () => null,
    // pullUpLoad:  () => null,
    startY: propTypes.number,
    refreshDelay: propTypes.number,
    freeScroll: propTypes.bool,
    mouseWheel: propTypes.bool,
    bounce: propTypes.bool
  };
  componentDidMount() {
    setTimeout(() => {
      this.initScroll();
    }, 20);
  }
  componentWillReceiveProps(nextProps) {
    // 刷新
    if (nextProps.data !== this.props.data) {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
  initScroll() {
    if (!this.refs.wrapperScroll) {
      return;
    }

    let options = {
      probeType: this.props.probeType,
      click: this.props.click,
      scrollY: this.props.freeScroll || this.props.direction === DIRECTION_V,
      scrollX: this.props.freeScroll || this.props.direction === DIRECTION_H,
      scrollbar: this.props.scrollbar,
      pullDownRefresh: this.props.pullDownRefresh,
      pullUpLoad: this.props.pullUpLoad,
      startY: this.props.startY,
      freeScroll: this.props.freeScroll,
      mouseWheel: this.props.mouseWheel,
      bounce: this.props.bounce
    };

    this.scroll = new BScroll(this.refs.wrapperScroll, options);

    if (this.props.listenScroll) {
      this.scroll.on('scroll', pos => {
        this.props.scroll(pos);
      });
    }
  }
  enable() {
    this.scroll && this.scroll.enable();
  }
  disable() {
    this.scroll && this.scroll.disable();
  }
  refresh() {
    this.scroll && this.scroll.refresh();
  }
  clickItem(e, item) {
    if (this.props.diyClick) {
      this.props.diyClick(item);
    }
  }
  render() {
    return (
      <div ref="wrapperScroll" className="o-scroll">
        <div className="scroll-content">
          <div ref="listWrapper">
            {this.props.children ? (
              this.props.children
            ) : (
              <ul className="list-content">
                {this.props.data
                  ? this.props.data.map((item, index) => (
                      <li
                        key={item + index}
                        className="list-item"
                        onClick={e => this.clickItem(e, item)}>
                        {item}
                      </li>
                    ))
                  : null}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Scroll;
