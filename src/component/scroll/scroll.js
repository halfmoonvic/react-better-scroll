/**** React应用依赖组件 ****/
// core
import './scroll.styl';
import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
/******* 第三方 组件库 *****/
import BScroll from 'better-scroll';
/**** 本地公用变量 公用函数 **/
import { getRect } from '@/common/js/dom';
/******* 本地 公用组件 *****/
import Bubble from 'component/bubble/bubble';
import Loading from 'component/loading/loading';
/**** 当前组件的 子组件等 ***/

const DIRECTION_H = 'horizontal';
const DIRECTION_V = 'vertical';

class Scroll extends PureComponent {
  static defaultProps = {
    data: [], // 滚动数据
    probeType: 1, // 滚动时派发事件
    click: true, // 是否可点击item，如果启用，外部传入 clickItem
    listenScroll: false, // 外部监听滚动，如果启用，外部传入 scroll
    listenBeforeScroll: false, // 滚动之前是否监听，外部传入 beforeScrollStart
    direction: DIRECTION_V, // 滚动方向
    scrollbar: false, // 是否显示 滚动条
    pullDownRefresh: false, // 是否开启下拉刷新
    pulldownRender: null, // 下拉刷新自定义html，应由外部传入
    pullUpLoad: false, // 是否开启上拉加载数据
    pullUpLoadRender: null, // 下拉加载数据自定义html，应由外部传入
    startY: 0, // 滚动的内容初始化时的位置
    refreshDelay: 20, // 延迟刷新的时间
    freeScroll: false, // 是否自由滚动
    mouseWheel: false, // PC端，鼠标滚动
    bounce: true // 滚动回弹
  };
  static propTypes = {
    data: propTypes.array,
    probeType: propTypes.number,
    click: propTypes.bool,
    listenScroll: propTypes.bool,
    listenBeforeScroll: propTypes.bool,
    direction: propTypes.string,
    scrollbar: () => null,
    pullDownRefresh: () => null,
    pullUpLoad: () => null,
    startY: propTypes.number,
    refreshDelay: propTypes.number,
    freeScroll: propTypes.bool,
    mouseWheel: propTypes.bool,
    bounce: propTypes.bool
  };
  constructor(props) {
    super(props);
    this.state = {
      beforePullDown: true, // 是否处于下拉刷新开始前状态
      isPullingDown: false, // 是否正在下拉刷新
      isRebounding: false, // 下拉刷新加载数据后，是否是正在回弹的状态
      pullDownStyle: {}, // pulldown-wrapper 的位置
      isPullUpLoad: false,
      pullUpDirty: true,
      bubbleY: 0 // 根据 BS 位置计算出来的一个值
    };
    this.pullDownInitTop = -50; // pulldown-wrapper 初始所在的位置，其高度大小是由其内容决定的。
  }
  get refreshTxt() {
    return (
      (this.props.pullDownRefresh && this.props.pullDownRefresh.txt) ||
      '刷新成功'
    );
  }
  get pullUpTxt() {
    const moreTxt =
      (this.props.pullUpLoad &&
        this.props.pullUpLoad.txt &&
        this.props.pullUpLoad.txt.more) ||
      '加载更多';

    const noMoreTxt =
      (this.props.pullUpLoad &&
        this.props.pullUpLoad.txt &&
        this.props.pullUpLoad.txt.noMore) ||
      '没有更多数据了';

    return this.state.pullUpDirty ? moreTxt : noMoreTxt;
  }
  componentDidMount() {
    setTimeout(() => {
      this.initScroll();
    }, 20);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.data.length) {
      setTimeout(() => {
        this.forceUpdate(true);
      }, this.props.refreshDelay);
    }
  }
  initScroll() {
    if (!this.refs.wrapperScroll) {
      return;
    }

    // 当数据少时，让 listWrapper 高度大小与 wrapperScroll 大小相一致
    if (this.refs.listWrapper && (this.props.pullDownRefresh || this.props.pullUpLoad)) {
      this.refs.listWrapper.style.minHeight = `${getRect(this.refs.wrapperScroll).height + 1}px`
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

    if (this.listenBeforeScroll) {
      this.scroll.on('beforeScrollStart', () => {
        this.props.beforeScrollStart();
      });
    }

    if (this.props.pullDownRefresh) {
      this._initPullDownRefresh();
    }

    if (this.props.pullUpLoad) {
      this._initPullUpLoad();
    }
  }
  disable() {
    this.scroll && this.scroll.disable();
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
  scrollTo() {
    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
  }
  scrollToElement() {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
  }
  clickItem(event, item) {
    if (this.props.clickItem) {
      this.props.clickItem(item);
    }
  }
  destroy() {
    this.scroll.destroy();
  }
  forceUpdate(dirty) {
    if (this.props.pullDownRefresh && this.state.isPullingDown) {
      // 数据获取成功后，将Loading组件置false
      this.setState({
        isPullingDown: false
      });
      this._reboundPullDown().then(() => {
        this._afterPullDown();
      });
    } else if (this.props.pullUpLoad && this.state.isPullUpLoad) {
      this.setState({
        isPullUpLoad: false
      });
      this.scroll.finishPullUp();
      this.setState({
        pullUpDirty: dirty
      });
      this.refresh();
    } else {
      this.refresh();
    }
  }
  // 下拉刷新开始
  _initPullDownRefresh() {
    // scroll 事件是只要有滚动便会触发。在 scroll 滚动的过程当中会监听到下拉刷新。继而触发 pullingDown 事件。
    this.scroll.on('pullingDown', () => {
      this.setState({
        beforePullDown: false,
        isPullingDown: true
      });
      this.props.pullingDown();
    });

    this.scroll.on('scroll', pos => {
      if (!this.props.pullDownRefresh) {
        return;
      }
      // 鼠标开始下拉刷新时候的动作，pulldown-wrapper 跟随下拉
      if (this.state.beforePullDown) {
        this.setState({
          bubbleY: Math.max(0, pos.y + this.pullDownInitTop),
          pullDownStyle: {
            // pulldown-wrapper 可以距离顶部的距离
            // 注意，pulldown-wrapper 的大小是由 其内部内容决定的。
            // 官方组件的 bubble 即为其内容，它的高度大小还可根据 传入的 bubbleY 来改变其本身高度
            top: `${Math.min(pos.y + this.pullDownInitTop, 10)}px`
          }
        });
      } else {
        this.setState({
          bubbleY: 0
        });
      }

      // 数据获取成功后，执行 forceUpdate，其中有关于将 isRebounding 的 条件
      if (this.state.isRebounding) {
        this.setState({
          // 控制 pulldown-wrapper 回弹的动画，使 pulldown-wrapper 逐步上移
          pullDownStyle: {
            top: `${10 - (this.props.pullDownRefresh.stop - pos.y)}px`
          }
        });
      }
    });
  }
  // 成功获取数据后，告知better-scroll数据已加载,开始回弹
  // 回弹动作在 _initPullDownRefresh函数里面,依靠监听 isRebounding 来触发
  _reboundPullDown() {
    // 数据获取成功后，显示刷新成功提示，过 stopTime 时间，执行 _afterPullDown 函数
    const { stopTime = 600 } = this.props.pullDownRefresh;
    return new Promise(resolve => {
      setTimeout(() => {
        this.setState({
          isRebounding: true
        });
        this.scroll.finishPullDown();
        resolve();
      }, stopTime);
    });
  }
  // 在 回弹动作完成后 执行此函数，即将 pulldonw-wrapper 置于初始位置
  _afterPullDown() {
    setTimeout(() => {
      this.setState({
        beforePullDown: true,
        isRebounding: false,
        pullDownStyle: {
          top: `${this.pullDownInitTop}px`
        }
      });
      this.refresh();
    }, this.scroll.options.bounceTime);
  }
  // 上来加载数据开始
  _initPullUpLoad() {
    this.scroll.on('pullingUp', () => {
      this.setState({
        isPullUpLoad: true
      });
      this.props.pullingUp();
    });
  }
  render() {
    console.log('scroll.js render...');
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
          {this.props.pullUpLoad ? (
            this.props.pullUpLoadRender ? (
              this.props.pullUpLoadRender
            ) : (
              <div className="pullup-wrapper">
                {!this.state.isPullUpLoad ? (
                  <div className="before-trigger">
                    <span>{this.pullUpTxt}</span>
                  </div>
                ) : (
                  <div className="after-trigger">
                    <Loading />
                  </div>
                )}
              </div>
            )
          ) : null}
        </div>
        {this.props.pullDownRefresh ? (
          this.props.pulldownRender ? (
            this.props.pulldownRender
          ) : (
            <div
              className="pulldown-wrapper"
              ref="pulldown"
              style={this.state.pullDownStyle}>
              {this.state.beforePullDown ? (
                <div className="before-trigger">
                  {/*<Bubble y={this.state.bubbleY} />*/}
                  Bubble 组件
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
          )
        ) : null}
      </div>
    );
  }
}

export default Scroll;
