import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Checkbox, Form, InputNumber, message } from 'antd';
import { updateProfile, reload } from '../auth/authActions';
import { getAuthenticatedUserNotificationsSettings, getAuthenticatedUserName } from '../reducers';
import withEditor from '../components/Editor/withEditor';
import Action from '../components/Button/Action';
import requiresLogin from '../auth/requiresLogin';
import { saveNotificationsSettings } from '../helpers/metadata';
import { notificationType } from '../../common/constants/waivio';
import { updateUserMetadata } from '../user/usersActions';

import './Settings.less';

@requiresLogin
@injectIntl
@connect(
  state => ({
    userName: getAuthenticatedUserName(state),
    settingsNotifications: getAuthenticatedUserNotificationsSettings(state),
  }),
  {
    updateProfile,
    reload,
    updateUserMetadata,
  },
)
@withEditor
export default class NotificationSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    settingsNotifications: PropTypes.shape().isRequired,
    userName: PropTypes.string,
    updateUserMetadata: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userName: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      notifications: {
        activationCampaign: props.settingsNotifications.activationCampaign,
        follow: props.settingsNotifications.follow,
        fillOrder: props.settingsNotifications.fillOrder,
        mention: props.settingsNotifications.mention,
        minimalTransfer: props.settingsNotifications.minimalTransfer,
        reblog: props.settingsNotifications.reblog,
        reply: props.settingsNotifications.reply,
        statusChange: props.settingsNotifications.statusChange,
        transfer: props.settingsNotifications.transfer,
        witness_vote: props.settingsNotifications.witness_vote,
        myPost: props.settingsNotifications.myPost,
        myComment: props.settingsNotifications.myComment,
        myLike: props.settingsNotifications.myLike,
        like: props.settingsNotifications.like,
        downvote: props.settingsNotifications.downvote,
        claimReward: props.settingsNotifications.claimReward,
        powerUp: props.settingsNotifications.powerUp,
      },

      isLoading: false,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    saveNotificationsSettings(this.state.notifications, this.props.userName)
      .then(res => {
        this.setState({ isLoading: false });
        this.props.updateUserMetadata(res);
        message.success(this.props.intl.formatMessage({ id: 'saved', defaultMessage: 'Saved' }));
      })
      .catch(err => message.error(err.message));
  };

  onChangeCheckbox = fields =>
    this.setState(prevState => ({
      ...prevState,
      notifications: {
        ...prevState.notifications,
        [fields]: !prevState.notifications[fields],
      },
    }));

  render() {
    const { notifications } = this.state;

    return (
      <div className="center">
        <h1>
          <FormattedMessage id="notification_settings" defaultMessage="Notification Settings" />
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <div className="Settings">
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="сommunity_actions" defaultMessage="Community actions" />:
              </h3>
            </div>
            <div className="Settings__section">
              {notificationType.сommunityActions.map(notify => (
                <div className="Settings__section__checkbox" key={notify.name}>
                  <Checkbox
                    checked={notifications[notify.name]}
                    onChange={() => this.onChangeCheckbox(notify.name)}
                  >
                    <FormattedMessage id={notify.id} defaultMessage={notify.defaultMessage} />
                  </Checkbox>
                </div>
              ))}
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="wallet_transactions" defaultMessage="Wallet transactions" />:
              </h3>
              <div className="Settings__section__checkbox Settings__section--flex-wrapper">
                <Checkbox
                  checked={notifications.transfer}
                  onChange={() => this.onChangeCheckbox('transfer')}
                >
                  <FormattedMessage id="incoming_transfers" defaultMessage="Incoming transfers" />
                </Checkbox>
                (
                <FormattedMessage
                  id="min_amount"
                  defaultMessage="min. amount: {input} USD"
                  values={{
                    input: (
                      <InputNumber
                        step={0.1}
                        min={0}
                        size="small"
                        defaultValue={notifications.minimalTransfer}
                        onChange={e =>
                          this.setState(prevState => ({
                            ...prevState,
                            notifications: {
                              ...prevState.notifications,
                              minimalTransfer: e,
                            },
                          }))
                        }
                      />
                    ),
                  }}
                />
                )
              </div>
              {notificationType.walletTransactions.map(notify => (
                <div className="Settings__section__checkbox" key={notify.name}>
                  <Checkbox
                    checked={notifications[notify.name]}
                    onChange={() => this.onChangeCheckbox(notify.name)}
                  >
                    <FormattedMessage id={notify.id} defaultMessage={notify.defaultMessage} />
                  </Checkbox>
                </div>
              ))}
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage id="my_actions" defaultMessage="My actions" />:
              </h3>
            </div>
            <div className="Settings__section">
              {notificationType.myActions.map(notify => (
                <div className="Settings__section__checkbox" key={notify.name}>
                  <Checkbox
                    checked={notifications[notify.name]}
                    onChange={() => this.onChangeCheckbox(notify.name)}
                  >
                    <FormattedMessage id={notify.id} defaultMessage={notify.defaultMessage} />
                  </Checkbox>
                </div>
              ))}
            </div>
            <div className="Settings__section">
              <h3>
                <FormattedMessage
                  id="security_alerts"
                  defaultMessage="Security alerts (always on)"
                />
                :
              </h3>
              <div className="Settings__section__inputs">
                <div className="Settings__section__checkbox">
                  <Checkbox checked disabled>
                    <FormattedMessage
                      id="security_alerts_info"
                      defaultMessage="Outgoing transfers, power downs, withdrawals from savings, delegations, password recovery requests, recovery address changes, app authorizations"
                    />
                  </Checkbox>
                </div>
              </div>
            </div>
            <Action
              primary
              big
              type="submit"
              disabled={isEqual(this.props.settingsNotifications, notifications)}
              loading={this.state.isLoading}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Action>
          </div>
        </Form>
      </div>
    );
  }
}
