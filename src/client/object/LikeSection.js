import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Form } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import RawSlider from '../components/Slider/RawSlider';
import {
  getAuthenticatedUser,
  getRate,
  getRewardFund,
  getVotePercent,
  getVotingPower,
} from '../reducers';
import { getVoteValue } from '../helpers/user';
import './LikeSection.less';

@injectIntl
@connect(state => ({
  rewardFund: getRewardFund(state),
  rate: getRate(state),
  defaultVotePercent: getVotePercent(state),
  user: getAuthenticatedUser(state),
  sliderMode: getVotingPower(state),
}))
class LikeSection extends React.Component {
  static propTypes = {
    form: PropTypes.shape().isRequired,
    onVotePercentChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,

    intl: PropTypes.shape().isRequired,
    sliderMode: PropTypes.bool,
    defaultVotePercent: PropTypes.number,
    user: PropTypes.shape(),
    rewardFund: PropTypes.shape(),
    rate: PropTypes.number,
  };

  static defaultProps = {
    sliderMode: false,
    defaultVotePercent: 100,
    user: {},
    rewardFund: {},
    rate: 1,
    disabled: false,
  };
  constructor(props) {
    super(props);

    this.state = {
      votePercent: props.defaultVotePercent / 100,
      voteWorth: 0,
      sliderVisible: false,
    };
  }

  componentDidMount = () => {
    if (this.props.sliderMode) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    }
    this.calculateVoteWorth(this.state.votePercent);
  };

  calculateVoteWorth = value => {
    const { user, rewardFund, rate, onVotePercentChange } = this.props;
    const voteWorth = getVoteValue(
      user,
      rewardFund.recent_claims,
      rewardFund.reward_balance,
      rate,
      value * 100,
    );
    this.setState({ votePercent: value, voteWorth });

    onVotePercentChange(value);
  };

  handleLikeClick = () => {
    if (this.props.sliderMode) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    }
  };

  render() {
    const { voteWorth, votePercent, sliderVisible } = this.state;
    const { form, intl, disabled } = this.props;

    return (
      <div className="LikeSection">
        <Form.Item>
          {form.getFieldDecorator('like', {
            valuePropName: 'checked',
            initialValue: true,
            rules: [
              {
                required: true,
                transform: value => value || undefined,
                type: 'boolean',
                message: intl.formatMessage({
                  id: 'need_like',
                  defaultMessage: 'Field is required',
                }),
              },
            ],
          })(
            <Checkbox onChange={this.handleLikeClick} disabled={disabled}>
              {intl.formatMessage({ id: 'like', defaultMessage: 'Like' })}
            </Checkbox>,
          )}
        </Form.Item>

        {form.getFieldValue('like') && sliderVisible && (
          <React.Fragment>
            <div className="like-slider">
              <RawSlider
                min={1}
                initialValue={votePercent}
                onChange={this.calculateVoteWorth}
                disabled={disabled}
              />
            </div>
            <div className="like-worth">
              <FormattedMessage
                id="vote_worth"
                defaultMessage="Vote worth {value}"
                values={{
                  value: voteWorth.toFixed(3),
                }}
              />
            </div>
          </React.Fragment>
        )}

        <div className="warning-wrapper">
          <FormattedMessage
            id="warning_message"
            defaultMessage="Object updates are posted by Waivio Bots in order to avoid technical posts in user feeds and spending limited resource credits on multiple posts by users, authors are required to upvote updates with voting power that should generate an equivalent of at least $0.001 to ensure validity of the posted content. Users receive 70% of author rewards in addition to standard curation rewards."
          />
        </div>
      </div>
    );
  }
}

export default LikeSection;
