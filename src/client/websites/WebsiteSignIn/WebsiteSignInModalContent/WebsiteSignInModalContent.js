import React from 'react';
import { injectIntl } from 'react-intl';
import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import PropTypes from 'prop-types';
import Loading from '../../../components/Icon/Loading';
import SocialButton from '../SocialButton';
import styles from '../styles';
import { isMobile } from '../../../../common/helpers/apiHelpers';

const WebsiteSignInModalContent = ({
  intl,
  loading,
  onClickHiveSignerAuthButton,
  responseSocial,
  handleFailure,
}) => (
  <div
    className="WebsiteSignInModalContent"
    style={{
      width: isMobile() ? 'auto' : '440px',
      borderRadius: '4px',
      boxShadow: '0px 0px 12px 2px rgba(34, 60, 80, 0.2)',
    }}
  >
    <div style={styles.formHeader}>
      <h1 style={{ ...styles.mainTitle, ...styles.resetTitleStyles }}>
        {intl.formatMessage({
          id: 'eat_out_earn_crypto',
          defaultMessage: 'eat out, earn crypto',
        })}
      </h1>
      <h2
        style={{
          ...styles.resetTitleStyles,
        }}
      >
        {intl.formatMessage({
          id: 'sign_in_for_reward',
          defaultMessage: 'Sign-In for rewards per meal.',
        })}
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
              textTransform: 'uppercase',
              color: '#000',
              fontSize: '20px',
              ...styles.resetParagraphStyles,
              textAlign: 'center',
            }}
          >
            {intl.formatMessage({ id: 'get_a_free', defaultMessage: 'get a free' })}{' '}
            <i>
              {intl.formatMessage({
                id: 'full_featured',
                defaultMessage: 'full-featured',
              })}
            </i>{' '}
            {intl.formatMessage({ id: 'account', defaultMessage: 'account' })}
          </h3>
          <SocialButton
            socialNetwork={'HiveSigner'}
            size={'28px'}
            onClick={onClickHiveSignerAuthButton}
          />
          <p>
            {intl.formatMessage({
              id: 'need_hive_account',
              defaultMessage: 'Need a Hive Account?',
            })}{' '}
            <a
              style={{
                fontWeight: 'bold',
                fontStyle: 'italic',
              }}
              href="https://signup.hive.io/"
            >
              {intl.formatMessage({ id: 'click_here', defaultMessage: 'Click here' })}.
            </a>
          </p>
          <p className="WebsiteSignInModalContent__or">
            {intl.formatMessage({ id: 'or', defaultMessage: 'or' })}
          </p>
          <h3
            style={{
              textTransform: 'uppercase',
              color: '#000',
              fontSize: '20px',
              textAlign: 'center',
              ...styles.resetParagraphStyles,
            }}
          >
            {intl.formatMessage({ id: 'get_a_free', defaultMessage: 'get a free' })}{' '}
            <i>{intl.formatMessage({ id: 'guest', defaultMessage: 'guest' })}</i>{' '}
            {intl.formatMessage({ id: 'account', defaultMessage: 'account' })}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <GoogleLogin
              clientId="623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com"
              onSuccess={response => responseSocial(response, 'google')}
              onFailure={handleFailure}
              cookiePolicy={'single_host_origin'}
              render={renderProps => (
                <SocialButton
                  socialNetwork={'Google'}
                  onClick={renderProps.onClick}
                  size={'25px'}
                />
              )}
            />
            {/* <FacebookLogin */}
            {/*  appId="754038848413420" */}
            {/*  autoLoad={false} */}
            {/*  callback={response => responseSocial(response, 'facebook')} */}
            {/*  disableMobileRedirect */}
            {/*  render={renderProps => ( */}
            {/*    <SocialButton */}
            {/*      socialNetwork={'Facebook'} */}
            {/*      onClick={renderProps.onClick} */}
            {/*      size={'30px'} */}
            {/*    /> */}
            {/*  )} */}
            {/* /> */}
          </div>
          <p
            style={{
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
              href="https://www.waivio.com/object/ylr-waivio/page#oxa-legal/xrj-terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i>Terms & Conditions</i>
            </a>
            , our{' '}
            <a
              href="https://www.waivio.com/object/ylr-waivio/page#oxa-legal/poi-privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i>Privacy Policy</i>
            </a>
            , and our{' '}
            <a
              href="https://www.waivio.com/object/ylr-waivio/page#oxa-legal/uid-cookies-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i>Cookies Policy</i>
            </a>
            .
          </p>
        </React.Fragment>
      )}
    </div>
  </div>
);

WebsiteSignInModalContent.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  onClickHiveSignerAuthButton: PropTypes.func.isRequired,
  handleFailure: PropTypes.func.isRequired,
  responseSocial: PropTypes.func.isRequired,
};
export default injectIntl(WebsiteSignInModalContent);
