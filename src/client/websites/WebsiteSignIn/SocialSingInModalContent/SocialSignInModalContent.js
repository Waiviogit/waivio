import React from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Loading from '../../../components/Icon/Loading';
import styles from '../styles';
import SocialGiftsButton from '../SocialGiftsButton';
import { isMobile } from '../../../../common/helpers/apiHelpers';

const SocialSignInModalContent = ({
  websiteTitle,
  intl,
  loading,
  hiveSinger,
  onClickHiveSingerAuthButton,
  responseSocial,
  handleFailure,
}) => (
  <div
    className="SocialSignInModalContent"
    style={{
      width: isMobile() ? 'auto' : '440px',
      borderRadius: '4px',
      boxShadow: '0px 0px 12px 2px rgba(34, 60, 80, 0.2)',
    }}
  >
    <div style={styles.formHeader}>
      <h1 style={{ ...styles.socialMainTitle, ...styles.resetTitleStyles }}>
        {intl.formatMessage({
          id: 'sign_in_for_rewards',
          defaultMessage: 'Sign in for rewards!',
        })}
      </h1>
      <h2
        style={{
          ...styles.resetTitleStyles,
          ...styles.webColor,
        }}
      >
        {websiteTitle}
      </h2>
    </div>
    <div
      style={{
        padding: '25px 40px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          <h3
            style={{
              color: '#aaaaaa',
              fontSize: '18px',
              ...styles.resetParagraphStyles,
              textAlign: 'center',
            }}
          >
            {intl.formatMessage({
              id: 'full_featured_hive_account',
              defaultMessage: 'Full-featured Hive account',
            })}
          </h3>

          <SocialGiftsButton
            socialNetwork={'HiveSinger'}
            size={'28px'}
            href={hiveSinger.getLoginURL()}
            onClick={onClickHiveSingerAuthButton}
          />
          <h3
            style={{
              color: '#aaaaaa',
              fontSize: '18px',
              textAlign: 'center',
              ...styles.resetParagraphStyles,
            }}
          >
            <div style={{ marginTop: '15px' }}>
              {intl.formatMessage({ id: 'guest_account', defaultMessage: 'Guest account' })}
            </div>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <GoogleLogin
              clientId="623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com"
              onSuccess={response => responseSocial(response, 'google')}
              onFailure={handleFailure}
              cookiePolicy={'single_host_origin'}
              render={renderProps => (
                <SocialGiftsButton
                  socialNetwork={'Google'}
                  onClick={renderProps.onClick}
                  size={'25px'}
                />
              )}
            />
            <FacebookLogin
              appId="754038848413420"
              autoLoad={false}
              callback={response => responseSocial(response, 'facebook')}
              disableMobileRedirect
              render={renderProps => (
                <SocialGiftsButton
                  socialNetwork={'Facebook'}
                  onClick={renderProps.onClick}
                  size={'23px'}
                />
              )}
            />
          </div>
          <p
            style={{
              ...styles.socialText,
              fontSize: '14px',
              textAlign: 'center',
              marginTop: '25px',
            }}
          >
            {intl.formatMessage({
              id: 'website_sing_in_modal_rules',
              defaultMessage: 'By using this service, you agree to our',
            })}{' '}
            <a
              href="https://wiv.socialgifts.pp.ua/checklist/ljc-legal#xrj-terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Terms & Conditions</span>
            </a>
            , our{' '}
            <a
              href="https://wiv.socialgifts.pp.ua/checklist/ljc-legal#poi-privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Privacy Policy</span>
            </a>
            , and our{' '}
            <a
              href="https://wiv.socialgifts.pp.ua/checklist/ljc-legal#uid-cookies-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Cookies Policy</span>
            </a>
            .
          </p>
          <p style={{ ...styles.socialText, marginTop: '15px' }}>
            {intl.formatMessage({
              id: 'need_hive_account',
              defaultMessage: 'Need a Hive Account?',
            })}{' '}
            <a href="https://signup.hive.io/">
              {intl.formatMessage({ id: 'sign_up', defaultMessage: 'Sign up' })}
            </a>
          </p>
        </React.Fragment>
      )}
    </div>
  </div>
);

SocialSignInModalContent.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  hiveSinger: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  onClickHiveSingerAuthButton: PropTypes.func.isRequired,
  websiteTitle: PropTypes.string.isRequired,
  handleFailure: PropTypes.func.isRequired,
  responseSocial: PropTypes.func.isRequired,
};
export default injectIntl(SocialSignInModalContent);
