import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Checkbox, Form, Input } from 'antd';
import { updateProfile, reload } from '../auth/authActions';
import {
  getIsReloading,
  getAuthenticatedUser,
  isGuestUser,
  getAuthenticatedUserNotificationsSettings,
} from '../reducers';
import { getMetadata } from '../helpers/postingMetadata';
import withEditor from '../components/Editor/withEditor';
import Action from '../components/Button/Action';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import requiresLogin from '../auth/requiresLogin';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import { saveNotificationsSettings } from '../helpers/metadata';
import { notificationType } from '../../common/constants/waivio';

import './Settings.less';

function mapPropsToFields(props) {
  const metadata = getMetadata(props.user);

  const profile = metadata.profile || {};

  return Object.keys(profile).reduce(
    (a, b) => ({
      ...a,
      [b]: Form.createFormField({
        value: profile[b],
      }),
    }),
    {},
  );
}

@requiresLogin
@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    reloading: getIsReloading(state),
    isGuest: isGuestUser(state),
    settingsNotifications: getAuthenticatedUserNotificationsSettings(state),
  }),
  {
    updateProfile,
    reload,
    saveNotificationsSettings,
  },
)
@Form.create({
  mapPropsToFields,
})
@withEditor
export default class NotificationSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    saveNotificationsSettings: PropTypes.func.isRequired,
    settingsNotifications: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    onImageUpload: () => {},
    onImageInvalid: () => {},
    userName: '',
    user: {},
    history: {},
    isGuest: false,
    updateProfile: () => {},
    reload: () => {},
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
        withdraw_route: props.settingsNotifications.withdraw_route,
        witness_vote: props.settingsNotifications.witness_vote,
        myPost: props.settingsNotifications.myPost,
        myComment: props.settingsNotifications.myComment,
        myLike: props.settingsNotifications.myLike,
        like: props.settingsNotifications.like,
        downvote: props.settingsNotifications.downvote,
        claimReward: props.settingsNotifications.claimReward,
      },

      isLoading: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ isLoading: true });
    this.props.saveNotificationsSettings.then();
  }

  onChangeCheckbox = fields =>
    this.setState(prevState => ({
      ...prevState,
      notifications: {
        ...prevState.notifications,
        [fields]: !prevState.notifications[fields],
      },
    }));

  render() {
    const { notifications } = this.state.notifications;

    return (
      <div className="shifted">
        <Helmet>
          <title>
            {this.props.intl.formatMessage({
              id: 'notification_settings',
              defaultMessage: 'Notification Settings',
            })}{' '}
            - Waivio
          </title>
        </Helmet>
        <div className="settings-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <MobileNavigation />
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
                  {notificationType['сommunityActions'].map(notify => (
                    <div className="Settings__section__checkbox" key={notifications[notify.name]}>
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
                      id="wallet_transactions"
                      defaultMessage="Wallet transactions"
                    />
                    :
                  </h3>
                  <div className="Settings__section__checkbox">
                    <Checkbox checked={notifications.transfer}>
                      <FormattedMessage
                        id="incoming_transfers"
                        defaultMessage="Incoming transfers (min. amount: {input} USD)"
                        values={{ input: <Input defaultValue={notifications.minimalTransfer} /> }}
                      />
                    </Checkbox>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="my_actions" defaultMessage="My actions" />:
                  </h3>
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
                <Action primary big type="submit" disabled loading={this.state.isLoading}>
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Action>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
