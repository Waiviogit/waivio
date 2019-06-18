import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ObjectOfTypePage extends Component {
  static propTypes = {
    some: PropTypes.string,
  };

  static defaultProps = {
    some: 'this is some def prop',
  };

  handler = () => console.log('need to commit', this.props.some);

  render() {
    return <div style={{ border: '1px solid gray' }}>{this.props.some}</div>;
  }
}

export default ObjectOfTypePage;
