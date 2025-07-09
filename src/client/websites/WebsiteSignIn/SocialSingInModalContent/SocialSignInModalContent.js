import { Alert, Icon, message } from 'antd';
import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Loading from '../../../components/Icon/Loading';
import HiveAuth from '../../../HiveAuth/HiveAuth';
import styles from '../styles';
import SocialGiftsButton from '../SocialGiftsButton';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import useQuery from '../../../../hooks/useQuery';

const SocialSignInModalContent = ({
  websiteTitle,
  intl,
  loading,
  onClickHiveSignerAuthButton,
  responseSocial,
  handleFailure,
  setIsModalOpen,
  websiteName,
  showCloseIcon,
}) => {
  const [showQR, setShowQr] = useState('');
  const [timeOutId, setTimeoutId] = useState('');
  const query = useQuery();
  const host = query.get('host');
  const backUrl = query.get('backUrl');
  const color = query.get('color');

  const handleCloseModal = () => {
    if (typeof window !== 'undefined' && (backUrl || host)) {
      if (backUrl) {
        window.location?.replace(backUrl);
      } else {
        window.location.href = `https://${host}`;
      }
    }
  };

  return (
    <div
      className="SocialSignInModalContent"
      style={{
        width: isMobile() ? 'auto' : '440px',
        borderRadius: '4px',
        boxShadow: '0px 0px 12px 2px rgba(34, 60, 80, 0.2)',
      }}
    >
      <div style={styles.formHeader}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ ...styles.socialMainTitle, ...styles.resetTitleStyles }}>
            {intl.formatMessage({
              id: 'sign_in_for_rewards',
              defaultMessage: 'Sign in for rewards!',
            })}
          </h1>
          {showCloseIcon && (
            <div
              style={isMobile() ? styles.closeButtonMobile : styles.closeButton}
              onClick={handleCloseModal}
            >
              <Icon type={'close'} />
            </div>
          )}
        </div>
        <h2
          style={{
            ...styles.resetTitleStyles,
            ...styles.webColor,
            color: `#${color}` || styles.webColor.color,
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
            {showQR ? (
              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Alert
                  message=""
                  description="Ensure you have both an active and a posting key for full functionality."
                  type="warning"
                />
                <p className="ModalSignIn__rules">
                  {isMobile()
                    ? 'Click on the QR Code to open your Hive Keychain Mobile (Hive Authentication app) and approve the request'
                    : 'Scan this QR code with a Hive Keychain or Hive Authentication app and approve the request.'}
                </p>
                {isMobile() ? (
                  <center>
                    <a
                      href={new URLSearchParams(showQR).get('data')}
                      style={{ color: `#${color}` }}
                    >
                      <img className="ModalSignIn__qr" src={showQR} alt={'qr'} />
                    </a>
                    <p className="ModalSignIn__rules">or</p>
                    <a
                      href={new URLSearchParams(showQR).get('data')}
                      style={{ color: `#${color}` }}
                    >
                      Click here
                    </a>
                  </center>
                ) : (
                  <img className="ModalSignIn__qr" src={showQR} alt={'qr'} />
                )}
              </div>
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
                  socialNetwork={'HiveSigner'}
                  size={'28px'}
                  onClick={onClickHiveSignerAuthButton}
                />
                <HiveAuth
                  isSite
                  onCloseSingIn={open => {
                    setIsModalOpen(open);
                    clearTimeout(timeOutId);
                  }}
                  style={isMobile() ? styles.mobileButton : styles.socialButton}
                  buttonStyle={{ ...styles.socialButtonText, marginRight: '38px' }}
                  setQRcodeForAuth={url => {
                    setShowQr(url);
                    const id = setTimeout(() => {
                      setShowQr('');
                      message.error('QR code has expired');
                    }, 60000);

                    setTimeoutId(id);
                  }}
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
                    clientId={
                      '623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com'
                    }
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
                  {/* <FacebookLogin */}
                  {/*  appId="754038848413420" */}
                  {/*  autoLoad={false} */}
                  {/*  callback={response => responseSocial(response, 'facebook')} */}
                  {/*  disableMobileRedirect */}
                  {/*  render={renderProps => ( */}
                  {/*    <SocialGiftsButton */}
                  {/*      socialNetwork={'Facebook'} */}
                  {/*      onClick={renderProps.onClick} */}
                  {/*      size={'23px'} */}
                  {/*    /> */}
                  {/*  )} */}
                  {/* /> */}
                </div>
              </React.Fragment>
            )}
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
                title={'Terms & Conditions'}
                href={`https://${websiteName}/object/ljc-legal?breadcrumbs=ljc-legal/xrj-terms-and-conditions`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: `#${color}` }}
              >
                <span>Terms & Conditions</span>
              </a>
              , our{' '}
              <a
                title={'Privacy Policy'}
                href={`https://${websiteName}/object/ljc-legal?breadcrumbs=ljc-legal/poi-privacy-policy`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: `#${color}` }}
              >
                <span>Privacy Policy</span>
              </a>
              , and our{' '}
              <a
                title={'Cookies Policy'}
                href={`https://${websiteName}/object/ljc-legal?breadcrumbs=ljc-legal/uid-cookies-policy`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: `#${color}` }}
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
              <a
                href="https://signup.hive.io/"
                target="_blank"
                rel="noreferrer"
                style={{ color: `#${color}` }}
              >
                {intl.formatMessage({ id: 'sign_up', defaultMessage: 'Sign up' })}
              </a>
            </p>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

SocialSignInModalContent.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  showCloseIcon: PropTypes.bool,
  onClickHiveSignerAuthButton: PropTypes.func.isRequired,
  websiteTitle: PropTypes.string.isRequired,
  websiteName: PropTypes.string.isRequired,
  handleFailure: PropTypes.func.isRequired,
  responseSocial: PropTypes.func.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};
export default injectIntl(SocialSignInModalContent);
