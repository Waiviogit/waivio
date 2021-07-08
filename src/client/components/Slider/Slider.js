import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { debounce } from 'lodash';
import USDDisplay from '../Utils/USDDisplay';
import RawSlider from './RawSlider';

import './Slider.less';

@injectIntl
export default class Slider extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    voteWorth: PropTypes.number,
    onChange: PropTypes.func,
    post: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      author: PropTypes.string,
    }),
    type: PropTypes.string,
  };

  static defaultProps = {
    value: 100,
    voteWorth: 0,
    onChange: () => {},
    post: {},
    type: 'confirm',
  };

  state = {
    value: 100,
  };

  componentWillMount() {
    if (this.props.value) {
      this.setState({
        value: this.props.value,
      });
    }
  }

  componentDidMount() {
    this.props.onChange(this.state.value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  getCurrentValue = () => this.props.voteWorth || 0;

  handleChange = debounce(value => {
    this.setState({ value }, () => {
      this.props.onChange(value);
    });
  }, 300);

  formatTip = value => (
    <div>
      <FormattedNumber
        style="percent" // eslint-disable-line react/style-prop-object
        value={value / 100}
      />
      <span style={{ opacity: '0.5' }}>
        {' '}
        <USDDisplay value={this.getCurrentValue()} />
      </span>
    </div>
  );

  render() {
    const { value } = this.state;
    const { type } = this.props;
    const oprtr = type === 'flag' ? '-' : '';

    return (
      <div className="Slider">
        <RawSlider
          initialValue={value}
          onChange={this.handleChange}
          tipFormatter={this.formatTip}
          oprtr={oprtr}
        />
        <div className="Slider__info">
          <h3>
            <span>
              <FormattedMessage id="like_slider_info" defaultMessage="Your vote will be worth." />{' '}
              {oprtr}
              {<USDDisplay value={this.getCurrentValue()} />}.
            </span>
          </h3>
        </div>
      </div>
    );
  }
}
