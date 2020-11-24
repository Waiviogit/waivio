import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { debounce } from 'lodash';
import { connect } from 'react-redux';

import config from '../../../waivioApi/routes';
import USDDisplay from '../Utils/USDDisplay';
import RawSlider from './RawSlider';
import Transfer from '../../wallet/Transfer/Transfer';
import { openTransfer } from '../../wallet/walletActions';
import { guestUserRegex } from '../../helpers/regexHelpers';
import { isGuestUser } from '../../reducers';

import './Slider.less';

@injectIntl
@connect(state => ({ isGuestUser: isGuestUser(state) }), {
  openTransfer,
})
export default class Slider extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    voteWorth: PropTypes.number,
    onChange: PropTypes.func,
    openTransfer: PropTypes.func,
    isPostCashout: PropTypes.bool,
    isGuestUser: PropTypes.bool,
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
    openTransfer: () => {},
    isPostCashout: false,
    isGuestUser: false,
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
    const { isPostCashout, post, type } = this.props;
    const isGuest = guestUserRegex.test(post.author);
    const oprtr = type === 'flag' ? '-' : '';
    const transferMemo = isGuest
      ? {
          id: 'user_to_guest_transfer',
          to: post.author,
          message: `Tips - ${post.title} - https://${config.appName}.com${post.url}`,
        }
      : `Tips - ${post.title} - https://${config.appName}.com${post.url}`;
    const openTippingTransfer = () =>
      this.props.openTransfer(post.author, 0, 'HIVE', transferMemo, config.appName, true);
    const textForCashoutPost = this.props.isGuestUser ? (
      <FormattedMessage
        id="like_slider_message_cashout_for_guest"
        defaultMessage="Older posts cannot be upvoted."
      />
    ) : (
      <FormattedMessage
        id="like_slider_message_cashout"
        defaultMessage="Older posts cannot be upvoted. Please consider {link} the author."
        values={{
          link: (
            <span role="presentation" className="Slider__tipping" onClick={openTippingTransfer}>
              <FormattedMessage id="tipping" defaultMessage="tipping" />
            </span>
          ),
        }}
      />
    );
    const currentText = isPostCashout ? (
      textForCashoutPost
    ) : (
      <FormattedMessage id="like_slider_info" defaultMessage="Your vote will be worth." />
    );

    return (
      <div className="Slider">
        {!isPostCashout && (
          <RawSlider
            initialValue={value}
            onChange={this.handleChange}
            tipFormatter={this.formatTip}
            oprtr={oprtr}
          />
        )}
        <div className="Slider__info">
          <h3>
            {currentText} {oprtr}
            {<USDDisplay value={this.getCurrentValue()} />}.
          </h3>
        </div>
        <Transfer />
      </div>
    );
  }
}
