import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import USDDisplay from '../Utils/USDDisplay';
import RawSlider from './RawSlider';
import { openTransfer } from '../../../store/walletStore/walletActions';
import { isPostCashout } from '../../vendor/steemitHelpers';
import Transfer from '../../wallet/Transfer/Transfer';
import './Slider.less';

@injectIntl
@connect(null, { openTransfer })
export default class Slider extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    voteWorth: PropTypes.number,
    onChange: PropTypes.func,
    post: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      author: PropTypes.string,
      created: PropTypes.string,
    }),
    type: PropTypes.string,
    openTransfer: PropTypes.func,
  };

  static defaultProps = {
    value: 100,
    voteWorth: 0,
    onChange: () => {},
    post: {},
    type: 'confirm',
    openTransfer: () => {},
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

  sendTip = () => this.props.openTransfer(this.props.post.author);

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
    const { type, post } = this.props;
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
          <Transfer sendTo={post.author} />
          {isPostCashout(post) ? (
            <h3>
              <span>
                <FormattedMessage
                  id="voting_after_7days_firstPart"
                  defaultMessage="Voting after 7 days will not affect the rewards. But you can always"
                />
                <Link onClick={this.sendTip}>
                  <FormattedMessage
                    id="voting_after_7days_secondPart"
                    defaultMessage="send a tip"
                  />
                </Link>
                <FormattedMessage
                  id="voting_after_7days_thirdPart"
                  defaultMessage=" to the author."
                />
              </span>
            </h3>
          ) : (
            <h3>
              <span>
                <FormattedMessage id="like_slider_info" defaultMessage="Your vote will be worth." />{' '}
                {oprtr}
                {<USDDisplay value={this.getCurrentValue()} />}.
              </span>
            </h3>
          )}
        </div>
      </div>
    );
  }
}
