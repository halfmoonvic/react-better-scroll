/**** React应用依赖组件 ****/
// core
import './navigation.styl';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import VerTicalScroll from 'container/vertical-scroll/vertical-scroll';
import IndexList from 'container/index-list/index-list';
/******* 第三方 组件库 *****/
/**** 本地公用变量 公用函数 **/
/******* 本地 公用组件 *****/
/**** 当前组件的 子组件等 ***/

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      navIndex: 0,
      navList: [
        {
          url: '/vertical-scroll',
          text: '普通 Scroll 组件',
          selected: false
        },
        {
          url: '/index-list',
          text: '索引组件',
          selected: false
        },
        {
          url: '/pick',
          text: 'Picker 组件',
          selected: false
        },
        {
          url: '/slide',
          text: 'Slide 组件',
          selected: false
        }
      ]
    };
  }
  render() {
    return (
      <Router>
        <Route
          render={({ location }) => {
            return (
              <div>
                <ul className="bs-list">
                  {this.state.navList.map((v, i) => (
                    <li className="bs-item" key={v.url}>
                      <Link
                        className="text"
                        to={v.url}
                        onClick={() => {
                          this.setState({ show: true });
                        }}>
                        {v.text}
                      </Link>
                    </li>
                  ))}
                </ul>
                <TransitionGroup>
                  <CSSTransition
                    key={location.pathname}
                    classNames="player"
                    timeout={300}>
                    <Switch location={location}>
                      <Route path="/vertical-scroll" component={VerTicalScroll} />
                      <Route path="/index-list" component={IndexList} />
                    </Switch>
                  </CSSTransition>
                </TransitionGroup>
              </div>
            );
          }}
        />
      </Router>
    );
  }
}

export default Navigation;
