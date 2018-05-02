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
import Bubble from 'component/bubble/bubble';
import Loading from 'component/loading/loading';
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
  constructor(props) {
    super(props);
    this.pullDownInitTop = -50
    this.state = {
      beforePullDown: true,
      isRebounding: false,
      isPullingDown: false,
      isPullUpLoad: false,
      pullUpDirty: true,
      pullDownStyle: {},
      bubbleY: 0
    };
  }
  get refreshTxt() {
    return (
      (this.props.pullDownRefresh && this.props.pullDownRefresh.txt) ||
      '刷新成功'
    );
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.data.length === 15) {
      console.log(nextProps.data, nextProps.data)
    // 刷新
      setTimeout(() => {
        this.forceUpdate(true);
      }, this.props.refreshDelay);
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

    if (this.props.pullDownRefresh) {
      this._initPullDownRefresh();
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
  clickItem(event, item) {
    if (this.props.clickItem) {
      this.props.clickItem(item);
    }
  }
  forceUpdate(dirty) {
    if (this.props.pullDownRefresh && this.state.isPullingDown) {
      this.setState({
        isPullingDown: false
      })
      this._reboundPullDown().then(() => {
        this._afterPullDown()
      })
    } else if (this.state.pullUpLoad && this.state.isPullUpLoad) {
      this.setState({
        isPullUpLoad: false
      })
      this.scroll.finishPullUp()
      this.pullUpDirty = dirty
      this.refresh()
    } else {
      this.refresh()
    }
  }
  _initPullDownRefresh() {
    this.scroll.on('pullingDown', () => {
      this.setState({
        beforePullDown: false,    // bs 事件触发顺序是 先 scroll，在鼠标放开后在触发 pullingDown
        isPullingDown: true
      });
      this.props.pullingDown();
    });

    this.scroll.on('scroll', pos => {
      if (!this.props.pullDownRefresh) {
        return;
      }
      if (this.state.beforePullDown) {
        this.setState({
          bubbleY: Math.max(0, pos.y + this.pullDownInitTop),
          pullDownStyle: {
            top: `${Math.min(pos.y + this.pullDownInitTop, 10)}px`
          }
        });
      } else {
        this.setState({
          bubbleY: 0
        });
      }

      if (this.state.isRebounding) {
        this.setState({
          pullDownStyle: {
            top: `${10 - (this.props.pullDownRefresh.stop - pos.y)}px`
          }
        });
      }
    });
  }
  _afterPullDown() {
    setTimeout(() => {
      this.pullDownStyle = `top:${this.pullDownInitTop}px`
      this.beforePullDown = true
      this.isRebounding = false
      this.refresh()
    }, this.scroll.options.bounceTime)
  }
  _reboundPullDown() {
    const {stopTime = 600} = this.props.pullDownRefresh
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setState({
          isRebounding: true
        })
        this.scroll.finishPullDown()
        resolve()
      }, stopTime)
    })
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
        {this.props.pulldown ? (
          this.props.pulldown
        ) : (
          <div
            className="pulldown-wrapper"
            ref="pulldown"
            style={this.state.pullDownStyle}>
            {this.state.beforePullDown ? (
              <div className="before-trigger">
                bubble component
                {/*<Bubble y={this.state.bubbleY} />*/}
              </div>
            ) : (
              <div className="after-trigger">
                {this.state.isPullingDown ? (
                  <div className="loading">
                    <Loading />
                  </div>
                ) : (
                  <div>
                    <span>{this.refreshTxt}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Scroll;
