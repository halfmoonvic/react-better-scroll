import './page.styl';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import propTypes from 'prop-types';

@withRouter
class Page extends Component {
  static defaultProps = {
    title: 'scroll 组件实例'
  };
  static propTypes = {
    title: propTypes.string.isRequired,
    desc: propTypes.element
  };
  constructor(props) {
    super(props);
    this.back = this.back.bind(this);
  }
  back() {
    this.props.history.goBack();
  }
  render() {
    return (
      <div className="o-page">
        <header className="header">
          <h1>{this.props.title}</h1>
          <img
            className="back"
            src={require('../../common/images/back.svg')}
            alt="back"
            onClick={this.back}
          />
        </header>
        <div className="wrapper">
          {this.props.desc ? (
            <section className="desc">{this.props.desc}</section>
          ) : null}
          <main className="content">{this.props.children}</main>
        </div>
      </div>
    );
  }
}

export default Page;
