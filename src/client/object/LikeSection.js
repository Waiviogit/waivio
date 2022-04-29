import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Form } from 'antd';
import { connect } from 'react-redux';
import { ceil, isEmpty } from 'lodash';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import RawSlider from '../components/Slider/RawSlider';
import USDDisplay from '../components/Utils/USDDisplay';
import { getAuthenticatedUser } from '../../store/authStore/authSelectors';
import { getVotePercent, getVotingPower } from '../../store/settingsStore/settingsSelectors';
import { calculateVotePowerForSlider } from '../vendor/steemitHelpers';

import './LikeSection.less';

@injectIntl
@connect(state => ({
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
    selectedType: PropTypes.shape({
      author: PropTypes.string,
      author_permlink: PropTypes.string,
      permlink: PropTypes.string,
    }),
  };

  static defaultProps = {
    sliderMode: false,
    defaultVotePercent: 100,
    user: {},
    rewardFund: {},
    selectedType: {},
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
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    }
    this.calculateVoteWorth(this.state.votePercent);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.selectedType !== this.props.selectedType) {
      this.calculateVoteWorth(this.state.votePercent);
    }
  }

  calculateVoteWorth = async value => {
    const { user, onVotePercentChange, selectedType } = this.props;

    if (isEmpty(selectedType)) return;

    const voteWorth = await calculateVotePowerForSlider(
      user.name,
      value,
      selectedType.author,
      selectedType.author_permlink || selectedType.permlink,
    );

    this.setState({ votePercent: value, voteWorth: ceil(voteWorth, 3) });

    onVotePercentChange(value);
  };

  handleLikeClick = () => {
    if (this.props.sliderMode) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    }
  };

  formatTip = value => (
    <div>
      <FormattedNumber
        style="percent" // eslint-disable-line react/style-prop-object
        value={value / 100}
      />
      <span style={{ opacity: '0.5' }}>
        {' '}
        <USDDisplay value={this.state.voteWorth} />
      </span>
    </div>
  );

  render() {
    const { voteWorth, votePercent, sliderVisible } = this.state;
    const { form, intl, disabled } = this.props;
    const likePrice = Number(voteWorth.toFixed(3)) || '0.001';

    return (
      <div className="LikeSection">
        <Form.Item className="like-form">
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
                tipFormatter={this.formatTip}
              />
            </div>
            <div className="like-worth">
              <FormattedMessage
                id="vote_worth"
                defaultMessage="Vote worth {value}"
                values={{
                  value: likePrice,
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
