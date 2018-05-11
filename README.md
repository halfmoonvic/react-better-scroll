## better-scroll 在 React 当中的应用实例

#### 1) 基础组件下拉刷新上拉加载执行顺序
##### 1. 外部组件使用 基础组件 `Scroll.js`，将一些必要数据传入给 `Scroll.js` 组件
```
－－－－－vertical-scroll.js－－－－－
this.state = {
  scrollbar: true,                   // 显示滚动条
  scrollbarFade: true,               // 滚动条渐隐
  startY: 0,                         // 初始化时，scroll 的位置
  items: [],                         // 数据

  pullDownRefresh: true,             // 开启下拉刷新
  pullDownRefreshThreshold: 90,      // 下拉刷新到 90px 位置时开始刷新请求数据
  pullDownRefreshStop: 40,           // 回弹停留的距离
    
  pullUpLoad: true,                  // 开启上拉加载选项
  pullUpLoadThreshold: 0,            // 上来加载时机
  pullUpLoadMoreTxt: '加载更多',       // 上拉加载时出现的文字提示
  pullUpLoadNoMoreTxt: '没有更多数据了'
};
```

`Vertical-scroll.js` 组件初始化，异步获取数据后，将数据传递给 `Scroll.js` 组件

##### 2. `Scroll.js` 组件开始执行
1. 执行声明周期勾子 `componentDidMount`，执行 `initScroll` 函数，初始化 `better-scroll` 实例
2. `initScroll` 函数中初始化 `better-scroll` 实例，将外部传入的参数及其 `Scroll.js` 组件内部默认的参数 传入到 `better-scroll` 中，完成初始化。
3. `initScroll` 函数中判断一些参数，如是否需要监听滚动、是否开启下拉刷新等。
4. 下拉刷新函数 `_initPullDownRefresh` 执行
    * 监听 `scroll` 滚动事件，在达到下拉阈值前，对 `pulldown-wrapper` 位置进行调节
    * 在达到下拉阈值后，执行监听函数 `pullingDown`，将一些参数 如 `beforePullDown: false` （隐藏 `Bubble.js` 组件）`isPullingDown: true`（显示 `Loading.js` 组件），并告知外部此时可以请求新的数据了。
    * 数据请求成功后会进行回弹。 在此 对 `pulldown-wrapper` 高度位置进行设置，使其缓慢向上移
5. 下拉数据获取成功后 执行 `forceUpdate(true)`。
    * `forceUpdate(true)` 函数的在 `Scroll.js` 组件当中执行，以便明确告知数据是成功获取过来的（`true`参数的作用)
    * 首先 `isPullingDown: false` 以便 让 `pulldown-wrapper` 隐藏掉 `Loading` 从而显示 `刷新成功的提示`
    * 随后执行 `_reboundPullDown()函数` 进行回弹，延时一定时间后（以便让上面的`刷新成功提示`做短暂停留） `isRebounding: true`。并告知 `better-scroll` 数据加载完毕，可以向上回弹了(`this.scroll.finishPullDown()`)
    * 回弹结束后执行 同步执行 `_afterPullDown`。`_afterPullDown` 函数当中将一些值置为初始值
4. 上拉加载数据 `_initPullUpLoad` 执行
    * 监听 `pullingUp` 事件，在达到上拉阈值的时候，将参数 `isPullUpLoad: true`（以便显示 `Loading.js` 组件）。之后告诉外部此时可以请求新的数据了。
5. 上拉数据获取成功后，执行 `forceUpdate(true)`。
    * `forceUpdate(true)` 函数的在 `Scroll.js` 组件当中执行，以便明确告知数据是成功获取过来的（`true`参数的作用)
    * 首先 `isPullUpLoad: false` 以便让 `pullup-wrapper` 隐藏掉 `Loading`。
    * 随后马上告知 `better-scroll` 数据加载完毕，可以收起来了。(` this.scroll.finishPullUp()`)
    * 设置参数 `pullUpDirty: dirty(true)` 以设置 是否有数据的提示语
