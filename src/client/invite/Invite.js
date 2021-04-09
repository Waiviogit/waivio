import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import requiresLogin from '../auth/requiresLogin';
import InviteGuestUser from './InviteGuestUser';
import InviteHiveUser from './InviteHiveUser';
import { getAuthenticatedUserName, isGuestUser } from '../store/authStore/authSelectors';
import { getIsUserInWaivioBlackList } from '../store/referralStore/referralSelectors';

import './Invite.less';

@requiresLogin
@injectIntl
@connect(state => ({
  authenticatedUserName: getAuthenticatedUserName(state),
  isGuest: isGuestUser(state),
  isBlackListUser: getIsUserInWaivioBlackList(state),
}))
export default class Invite extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    authenticatedUserName: PropTypes.string,
    isGuest: PropTypes.bool,
    isBlackListUser: PropTypes.bool,
  };

  static defaultProps = {
    authenticatedUserName: '',
    isGuest: false,
    isBlackListUser: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      copied: false,
      inviteURL: '',
    };

    this.handleCopyClick = this.handleCopyClick.bind(this);
  }

  componentDidMount() {
    this.createInviteURL();
  }

  createInviteURL() {
    const { authenticatedUserName, isGuest } = this.props;

    if (typeof window !== 'undefined') {
      const inviteURL = isGuest
        ? `${window.location.protocol}//${window.location.host}/i/@${authenticatedUserName}`
        : `https://www.waivio.com?ref=${authenticatedUserName}`;

      this.setState({ inviteURL });
    }
  }

  handleCopyClick() {
    this.setState({ copied: true });
  }

  handleRenderComponents = buttonLabel => {
    const { intl, isGuest, authenticatedUserName, isBlackListUser } = this.props;
    const { inviteURL } = this.state;

    const data = {
      intl,
      buttonLabel,
      inviteURL,
      handleCopyClick: this.handleCopyClick,
      authenticatedUserName,
    };

    if (isBlackListUser) {
      return (
        <FormattedMessage
          id="referrals_instructions_is_blacklist"
          defaultMessage="Your account {username} is listed in the Waivio’s blacklist or in other blacklists trusted by Waivio and you are not eligible to participate in the Referral program."
          values={{
            username: (
              <Link to={`/@${authenticatedUserName}`}>
                <span className="is-blacklist__referral-username">{authenticatedUserName}</span>
              </Link>
            ),
          }}
        />
      );
    } else if (isGuest) {
      return <InviteGuestUser data={data} />;
    }

    return <InviteHiveUser data={data} />;
  };

  render() {
    const buttonLabel = this.state.copied ? (
      <FormattedMessage id="invite_copied" defaultMessage="Copied" />
    ) : (
      <FormattedMessage id="invite_copy_link" defaultMessage="Copy link" />
    );

    return this.handleRenderComponents(buttonLabel);
  }
}
