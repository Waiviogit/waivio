import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FormattedMessage } from 'react-intl';
import { REFERRAL_PERCENT } from '../helpers/constants';
import FacebookShare from '../components/Button/FacebookShare';
import TwitterShare from '../components/Button/TwitterShare';
import EmailShare from '../components/Button/EmailShare';

const InviteGuestUser = ({ data }) => {
  const { intl, buttonLabel, inviteURL, handleCopyClick } = data;

  return (
    <div className="Invite">
      <div className="Invite__icon-container" />
      <h1 className="Invite__title">
        <FormattedMessage id="invite_title" defaultMessage="Don't use Waivio alone!" />
      </h1>
      <p className="Invite__description">
        <FormattedMessage
          id="invite_info"
          defaultMessage="Onboard new users on Waivio today using the link below and get {percent}% of their rewards for {days} days."
          values={{
            percent: REFERRAL_PERCENT / 100,
            days: 30,
          }}
        />
      </p>
      <div className="Invite__input-container">
        <div className="Invite__input-wrapper">
          <Input className="Invite__input" value={inviteURL} readOnly />
          <CopyToClipboard text={inviteURL} onCopy={handleCopyClick}>
            <span className="Invite__input__copy">{buttonLabel}</span>
          </CopyToClipboard>
        </div>
      </div>
      <div className="Invite__social">
        <FacebookShare url={inviteURL} />
        <TwitterShare
          url={inviteURL}
          text={intl.formatMessage(
            {
              id: 'invite_share',
              defaultMessage: 'Join me today on Waivio and get rewarded to blog {link}',
            },
            {
              link: '',
            },
          )}
        />
        <EmailShare
          url={inviteURL}
          text={intl.formatMessage(
            {
              id: 'invite_share',
              defaultMessage: 'Join me today on Waivio and get rewarded to blog {link}',
            },
            {
              link: inviteURL,
            },
          )}
        />
      </div>
    </div>
  );
};

InviteGuestUser.propTypes = {
  data: PropTypes.shape().isRequired,
  intl: PropTypes.shape(),
  buttonLabel: PropTypes.element,
  inviteURL: PropTypes.string,
  handleCopyClick: PropTypes.func,
};

InviteGuestUser.defaultProps = {
  intl: {},
  buttonLabel: <FormattedMessage />,
  inviteURL: '',
  handleCopyClick: () => {},
};

export default InviteGuestUser;
