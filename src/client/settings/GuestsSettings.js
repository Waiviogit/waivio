import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal } from 'antd';
import { saveSettings } from '../../store/settingsStore/settingsActions';
import { reload } from '../../store/authStore/authActions';
import { notify } from '../app/Notification/notificationActions';
import Loading from '../components/Icon/Loading';
import requiresLogin from '../auth/requiresLogin';
import LinkHiveAccountModal from './LinkHiveAccountModal';
import EmailConfirmation from '../widgets/EmailConfirmation';
import { getUserPrivateEmail } from '../../store/usersStore/usersActions';
import {
  getAuthenticatedUserName,
  getAuthenticatedUserPrivateEmail,
  getIsReloading,
} from '../../store/authStore/authSelectors';
import {
  getHiveBeneficiaryAccount,
  getIsSettingsLoading,
  getRewriteLinks,
} from '../../store/settingsStore/settingsSelectors';

import './Settings.less';

@requiresLogin
@injectIntl
@connect(
  state => ({
    reloading: getIsReloading(state),
    rewriteLinks: getRewriteLinks(state),
    loading: getIsSettingsLoading(state),
    user: getAuthenticatedUserName(state),
    hiveBeneficiaryAccount: getHiveBeneficiaryAccount(state),
    privateEmail: getAuthenticatedUserPrivateEmail(state),
  }),
  { reload, saveSettings, notify, getUserPrivateEmail },
)
export default class GuestsSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func,
    }).isRequired,
    reloading: PropTypes.bool,
    reload: PropTypes.func,
    saveSettings: PropTypes.func,
    notify: PropTypes.func,
    resetSearchAutoCompete: PropTypes.func,
    hiveBeneficiaryAccount: PropTypes.string.isRequired,
    privateEmail: PropTypes.string,
    user: PropTypes.string.isRequired,
    getUserPrivateEmail: PropTypes.func.isRequired,
  };

  static defaultProps = {
    reloading: false,
    reload: () => {},
    saveSettings: () => {},
    notify: () => {},
    resetSearchAutoCompete: () => {},
    privateEmail: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      hiveBeneficiaryAccount: props.hiveBeneficiaryAccount,
      privateEmail: props.privateEmail,
      searchBarActive: '',
      dropdownOpen: false,
      showModal: false,
      showModalPrivate: false,
    };
  }

  componentWillMount() {
    this.setState({
      hiveBeneficiaryAccount: this.props.hiveBeneficiaryAccount,
      privateEmail: this.props.privateEmail,
    });
  }

  componentDidMount() {
    this.props.reload();
    this.props.getUserPrivateEmail(this.props.user);
  }

  unlinkHiveAccount = () => {
    const { user, intl } = this.props;

    Modal.confirm({
      title: intl.formatMessage({
        id: 'unlink_hive_account',
        defaultMessage: 'Unlink Hive account',
      }),
      content: this.props.intl.formatMessage(
        {
          id: 'unlink_hive_account_message',
          defaultMessage:
            'Do you want to unlink @{hiveUser} Hive account from your @{user} guest account?',
        },
        {
          hiveUser: this.state.hiveBeneficiaryAccount,
          user,
        },
      ),
      onOk: () => {
        this.setState({ hiveBeneficiaryAccount: '' });
        this.props
          .saveSettings({
            hiveBeneficiaryAccount: '',
          })
          .then(() =>
            this.props.notify(
              this.props.intl.formatMessage({ id: 'saved', defaultMessage: 'Saved' }),
              'success',
            ),
          );
      },
    });
  };

  hideAutoCompleteDropdown = value => {
    this.setState(
      {
        hiveBeneficiaryAccount: value.account,
        showSelectAccount: true,
      },
      this.props.resetSearchAutoCompete,
    );
  };

  handleSave = () => {
    this.props
      .saveSettings({
        hiveBeneficiaryAccount: this.state.hiveBeneficiaryAccount,
      })
      .then(() =>
        this.props.notify(
          this.props.intl.formatMessage({ id: 'saved', defaultMessage: 'Saved' }),
          'success',
        ),
      );
  };

  handleUnselectUser = () => {
    this.setState({
      searchBarValue: '',
      hiveBeneficiaryAccount: '',
    });
  };

  handleOkModal = () => {
    this.handleSave();
    this.setState({ showModal: false });
  };

  render() {
    const { reloading } = this.props;
    const { hiveBeneficiaryAccount, showModal, showModalPrivate } = this.state;

    return (
      <div className="shifted">
        <div className="center">
          <h1>
            <FormattedMessage
              id="guests_account_settings"
              defaultMessage="Guests Account Settings"
            />
          </h1>
          {reloading ? (
            <Loading center={false} />
          ) : (
            <div className="Settings">
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="linked_hive_account" defaultMessage="Linked Hive account" />
                </h3>
                <p>
                  <FormattedMessage
                    id="linked_hive_account_details"
                    defaultMessage="Registered Hive account becomes the recipient for all your author rewards, other rewards, and your transfers."
                  />
                </p>
                {hiveBeneficiaryAccount ? (
                  <div>
                    <span>@{hiveBeneficiaryAccount}</span>(
                    <a role="presentation" onClick={this.unlinkHiveAccount}>
                      <FormattedMessage id="unlink" defaultMessage="unlink" />
                    </a>
                    )
                  </div>
                ) : (
                  <a role="presentation" onClick={() => this.setState({ showModal: true })}>
                    <FormattedMessage
                      id="linked_you_hive_account"
                      defaultMessage="Link your Hive account"
                    />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        <LinkHiveAccountModal
          handleOk={this.handleOkModal}
          handleSelect={this.hideAutoCompleteDropdown}
          handleClose={() => this.setState({ showModal: false, hiveBeneficiaryAccount: '' })}
          showModal={showModal}
          hiveBeneficiaryAccount={hiveBeneficiaryAccount}
          // handleUnselectUser={this.handleUnselectUser}
        />
        <EmailConfirmation
          isSettings
          visible={showModalPrivate}
          handleClose={() => this.setState({ showModalPrivate: false })}
        />
      </div>
    );
  }
}
