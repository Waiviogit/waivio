import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Collapse, Select } from 'antd';
import { injectIntl } from 'react-intl';
import { BENEFICIARY_PERCENT } from '../../helpers/constants';
import { rewardsValues } from '../../../common/constants/rewards';
import './AdvanceSettings.less';

@injectIntl
class AdvanceSettings extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    isUpdating: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {
    isUpdating: false,
  };

  handleRewardChange = reward => this.props.onChange({ reward });

  handleBeneficiaryChange = e => this.props.onChange({ beneficiary: e.target.checked });

  handleUpvoteChange = e => this.props.onChange({ upvote: e.target.checked });

  render() {
    const { intl, isUpdating } = this.props;
    return (
      <Collapse>
        <Collapse.Panel
          header={intl.formatMessage({
            id: 'advance_settings',
            defaultMessage: 'Advance settings',
          })}
        >
          <div className="rewards-settings">
            <div className="rewards-settings__label">
              {intl.formatMessage({ id: 'reward', defaultMessage: 'Reward' })}
            </div>
            <div className="rewards-settings__control">
              <Select onChange={this.handleRewardChange} disabled={isUpdating}>
                <Select.Option value={rewardsValues.all}>
                  {intl.formatMessage({
                    id: 'reward_option_100',
                    defaultMessage: '100% Steem Power',
                  })}
                </Select.Option>
                <Select.Option value={rewardsValues.half}>
                  {intl.formatMessage({
                    id: 'reward_option_50',
                    defaultMessage: '50% SBD and 50% SP',
                  })}
                </Select.Option>
                <Select.Option value={rewardsValues.none}>
                  {intl.formatMessage({ id: 'reward_option_0', defaultMessage: 'Declined' })}
                </Select.Option>
              </Select>
            </div>
          </div>
          {!isUpdating && (
            <div className="beneficiary-settings">
              <Checkbox onChange={this.handleBeneficiaryChange} disabled={isUpdating}>
                {intl.formatMessage(
                  {
                    id: 'add_waivio_beneficiary',
                    defaultMessage: 'Share {share}% of this post rewards with Waivio',
                  },
                  { share: BENEFICIARY_PERCENT / 100 },
                )}
              </Checkbox>
            </div>
          )}
          <div className="upvote-settings">
            <Checkbox onChange={this.handleUpvoteChange} disabled={isUpdating}>
              {intl.formatMessage({ id: 'like_post', defaultMessage: 'Like this post' })}
            </Checkbox>
          </div>
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default AdvanceSettings;
