import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FormattedMessage } from 'react-intl';
import FacebookShare from '../components/Button/FacebookShare';
import TwitterShare from '../components/Button/TwitterShare';
import EmailShare from '../components/Button/EmailShare';

const InviteHiveUser = ({ data }) => {
  const { intl, buttonLabel, inviteURL, handleCopyClick, authenticatedUserName } = data;

  return (
    <div className="Invite">
      <div className="Invite__icon-container" />
      <h1 className="Invite__title">
        <FormattedMessage id="invite_title_hive" defaultMessage="Invite friends now!" />
      </h1>
      <p className="Invite__description">
        <FormattedMessage
          id="invite_info_hive"
          defaultMessage="Invite your friends and family to join you on Waivio and collect rewards together with them!"
        />
      </p>
      <p className="Invite__description">
        <FormattedMessage
          id="invite_info_hive_period"
          defaultMessage="Please use the link below to invite new users and start receiving {referralCommissions} from their sponsored rewards for a period of 90 days! These commissions are paid by the sponsors in addition to the sponsored rewards collected by users."
          values={{
            referralCommissions: (
              <Link to={`/rewards/referral-details/${authenticatedUserName}`}>
                <span className="commissions-payments__receivables">
                  <FormattedMessage
                    id="invite_referral_commissions"
                    defaultMessage="referral commissions"
                  />
                </span>
              </Link>
            ),
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

InviteHiveUser.propTypes = {
  data: PropTypes.shape().isRequired,
  intl: PropTypes.shape(),
  buttonLabel: PropTypes.element,
  inviteURL: PropTypes.string,
  handleCopyClick: PropTypes.func,
  authenticatedUserName: PropTypes.string,
};

InviteHiveUser.defaultProps = {
  intl: {},
  buttonLabel: <FormattedMessage />,
  inviteURL: '',
  handleCopyClick: () => {},
  authenticatedUserName: '',
};

export default InviteHiveUser;
