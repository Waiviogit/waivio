import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, message, Alert } from 'antd';
import hivesigner from 'hivesigner';
import { batch, connect, useDispatch } from 'react-redux';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { setGoogleTagEvent } from '../../../../common/helpers';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import {
  login,
  busyLogin,
  getAuthGuestBalance,
  changeRewardsTab,
} from '../../../../store/authStore/authActions';
import { isUserRegistered } from '../../../../waivioApi/ApiClient';
import {
  getFollowing,
  getFollowingObjects,
  getNotifications,
} from '../../../../store/userStore/userActions';
import { getRate, getRewardFund } from '../../../../store/appStore/appActions';
import { getRebloggedList } from '../../../../store/reblogStore/reblogActions';
import GuestSignUpForm from '../GuestSignUpForm/GuestSignUpForm';
import Spinner from '../../Icon/Loading';
import HiveAuth from '../../../HiveAuth/HiveAuth';
import SocialButtons from '../SocialButtons/SocialButtons';
import SignUpButton from '../SignUpButton/SignUpButton';
import {
  clearAllSessionProposition,
  getSessionData,
  removeSessionData,
} from '../../../rewards/rewardsHelper';
import {
  getAppHost,
  getIsWaivio,
  getUsedLocale,
  getWebsiteNameForHeader,
  getWebsiteParentHost,
} from '../../../../store/appStore/appSelectors';
import WebsiteSignIn from '../../../websites/WebsiteSignIn/WebsiteSignIn';
import useWebsiteColor from '../../../../hooks/useWebsiteColor';

import './ModalSignIn.less';

const ModalSignIn = ({
  intl,
  showModal,
  handleLoginModalCancel,
  hideLink,
  isButton,
  setIsShowSignInModal,
  toCurrentWobjLink,
  history,
  buttonClassName,
  text,
  host,
  isWaivio,
  domain,
  usedLocale,
  websiteName,
  isSocialGifts,
}) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQR, setShowQr] = useState('');
  const [userData, setUserData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = React.useState('');
  const [timeOutId, setTimeoutId] = React.useState('');
  const colors = useWebsiteColor();
  let callbackURL = `https://${host}/callback`;

  if (host.includes('localhost') && typeof location !== 'undefined') {
    callbackURL = `${location.origin}/callback`;
  }

  const hiveSigner = new hivesigner.Client({
    app: process.env.STEEMCONNECT_CLIENT_ID,
    callbackURL,
  });
  const isWidget = getSessionData('isWidget');

  useEffect(() => {
    if (showModal) setIsModalOpen(true);
  }, [showModal]);

  useEffect(() => {
    if (!isModalOpen && timeOutId) {
      clearTimeout(timeOutId);
      setTimeoutId('');
    }
  }, [isModalOpen]);

  const responseSocial = async (response, socialNetwork) => {
    setIsLoading(true);

    if (response.error || (isEmpty(response.id) && isEmpty(response.googleId))) {
      setIsLoading(false);
      setIsShowSignInModal(false);
      setIsModalOpen(false);
    } else if (isModalOpen && response) {
      const id = socialNetwork === 'google' ? response.googleId : response.id;
      const res = await isUserRegistered(id, socialNetwork);

      if (res) {
        dispatch(login(response.accessToken, socialNetwork)).then(() => {
          setIsLoading(false);
          batch(() => {
            dispatch(getFollowing());
            dispatch(getFollowingObjects());
            dispatch(getNotifications());
            dispatch(busyLogin());
            dispatch(getRewardFund());
            dispatch(getRebloggedList());
            dispatch(getRate());
            dispatch(getAuthGuestBalance());
            dispatch(changeRewardsTab());
          });
        });
      } else {
        let image = '';

        if (socialNetwork === 'google') {
          if (response.w3) {
            image = response.w3.Paa;
          } else if (response.profileObj) {
            image = response.profileObj.imageUrl;
          }
        } else if (response.picture) {
          image = response.picture.data.url;
        }

        setUserData({ ...response, image, socialNetwork });
        setIsFormVisible(true);
      }
    }
  };

  const handleClickLoading = () => {
    setGoogleTagEvent('click_sign_in_google');
    if (lastError !== 'idpiframe_initialization_failed') {
      setIsLoading(true);
    }
  };

  const renderGuestSignUpForm = () => (
    <div className="ModalGuestForm">
      <GuestSignUpForm userData={userData} isModalOpen={isModalOpen} url={host} />
    </div>
  );

  const renderSignIn = () => {
    if (!isWaivio)
      return (
        <WebsiteSignIn
          isSocial={isSocialGifts}
          setUserData={setUserData}
          setIsFormVisible={setIsFormVisible}
          setIsModalOpen={setIsModalOpen}
          url={host}
        />
      );

    const linkData = new URLSearchParams(showQR).get('data');

    return (
      <React.Fragment>
        <div className="ModalSignIn">
          {isLoading ? (
            <h2 className="ModalSignIn__loading">
              {intl.formatMessage({
                id: 'signing',
                defaultMessage: 'Signing in!',
              })}
            </h2>
          ) : (
            <h2 className="ModalSignIn__title">
              {intl.formatMessage({
                id: 'signinForRewards',
                defaultMessage: 'Sign in for rewards!',
              })}
            </h2>
          )}
          {isLoading ? (
            <Spinner />
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
                      <a href={linkData}>
                        <img className="ModalSignIn__qr" src={showQR} alt={'qr'} />
                      </a>
                      <p className="ModalSignIn__rules">or</p>
                      <a href={linkData}>Click here</a>
                    </center>
                  ) : (
                    <img className="ModalSignIn__qr" src={showQR} alt={'qr'} />
                  )}
                </div>
              ) : (
                <React.Fragment>
                  <p className="ModalSignIn__rules">
                    {intl.formatMessage({
                      id: 'sing_in_modal_message',
                      defaultMessage: 'Waivio is powered by the Hive open social blockchain',
                    })}
                  </p>
                  <p className="ModalSignIn__title ModalSignIn__title--lined">
                    <span>
                      {intl.formatMessage({
                        id: 'steem_accounts',
                        defaultMessage: 'HIVE ACCOUNTS',
                      })}
                    </span>
                  </p>
                  <div
                    onClick={() => {
                      setGoogleTagEvent('click_sign_in_hivesigner');
                      window.location.href = hiveSigner.getLoginURL();
                    }}
                    className="ModalSignIn__signin"
                  >
                    <img
                      src="/images/icons/logo-hive.svg"
                      alt="hive"
                      className="ModalSignIn__icon-steemit"
                    />
                    {intl.formatMessage({
                      id: 'signin_with_steemIt',
                      defaultMessage: 'HiveSigner',
                    })}
                  </div>
                  <HiveAuth
                    onCloseSingIn={open => {
                      setIsModalOpen(open);
                      clearTimeout(timeOutId);
                      setGoogleTagEvent('click_sign_in_hiveauth');
                    }}
                    setQRcodeForAuth={url => {
                      setShowQr(url);
                      const id = setTimeout(() => {
                        setShowQr('');
                        message.error('QR code has expired');
                      }, 60000);

                      setTimeoutId(id);
                    }}
                    text={'HiveAuth'}
                  />
                  <p className="ModalSignIn__title ModalSignIn__title--lined">
                    <span>
                      {intl.formatMessage({
                        id: 'guestAccounts',
                        defaultMessage: 'GUEST ACCOUNTS',
                      })}
                    </span>
                  </p>
                  <div onClick={handleClickLoading} role="presentation">
                    <SocialButtons
                      className="ModalSignIn__social"
                      responseSocial={responseSocial}
                      lastError={lastError}
                      setLastError={setLastError}
                    />
                  </div>
                </React.Fragment>
              )}

              <p className="ModalSignIn__rules">
                {intl.formatMessage({
                  id: 'sing_in_modal_rules',
                  defaultMessage: 'By using this Service, you agree to be bound by',
                })}
                &ensp;
                <a
                  href="https://www.waivio.com/object/ylr-waivio/page#oxa-legal/xrj-terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {intl.formatMessage({
                    id: 'terms_and_conditions',
                    defaultMessage: 'the Terms and Conditions',
                  })}
                </a>
                ,&ensp;
                <a
                  href="https://www.waivio.com/object/ylr-waivio/page#oxa-legal/poi-privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {intl.formatMessage({
                    id: 'privacy_policy',
                    defaultMessage: 'the Privacy Policy',
                  })}
                </a>
                ,&ensp;
                <a
                  href="https://www.waivio.com/object/ylr-waivio/page#oxa-legal/uid-cookies-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {intl.formatMessage({
                    id: 'cookies_policy',
                    defaultMessage: 'the Cookies Policy',
                  })}
                </a>
                .
              </p>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  };

  const onModalClose = () => {
    setIsModalOpen(false);
    setIsShowSignInModal(false);
    setIsFormVisible(false);
    handleLoginModalCancel();
    setShowQr('');

    if (timeOutId) clearTimeout(timeOutId);
  };

  const onSignUpClick = isOpen => {
    setGoogleTagEvent('click_sign_in');
    if (!isWaivio && domain) {
      window.location.href = `https://${domain}/sign-in?host=${host}&color=${colors.background.replace(
        '#',
        '',
      )}&usedLocale=${usedLocale}&websiteName=${websiteName || host}`;
    } else {
      setIsModalOpen(isOpen);
    }
  };

  const memoizedOnModalClose = useCallback(() => {
    if (isWidget) {
      removeSessionData('userName', 'isWidget');
      clearAllSessionProposition();
      history.push(toCurrentWobjLink);
    }

    onModalClose();
  }, [timeOutId]);

  return (
    <React.Fragment>
      {!hideLink && (
        <SignUpButton
          isButton={isButton}
          setIsModalOpen={onSignUpClick}
          className={buttonClassName}
          text={text}
        />
      )}
      <Modal
        width={480}
        visible={isModalOpen}
        onCancel={memoizedOnModalClose}
        footer={null}
        closable={!isLoading}
        className={!isWaivio ? 'ModalSignIn__website' : ''}
      >
        {isFormVisible ? renderGuestSignUpForm() : renderSignIn()}
      </Modal>
    </React.Fragment>
  );
};

ModalSignIn.propTypes = {
  text: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  showModal: PropTypes.bool,
  handleLoginModalCancel: PropTypes.func,
  hideLink: PropTypes.bool,
  isSocialGifts: PropTypes.bool,
  isButton: PropTypes.bool,
  usedLocale: PropTypes.string,
  setIsShowSignInModal: PropTypes.func,
  toCurrentWobjLink: PropTypes.string,
  websiteName: PropTypes.string,
  buttonClassName: PropTypes.string,
  history: PropTypes.shape(),
  host: PropTypes.string.isRequired,
  isWaivio: PropTypes.bool.isRequired,
  domain: PropTypes.string,
};

ModalSignIn.defaultProps = {
  buttonClassName: '',
  domain: '',
  text: '',
  showModal: false,
  handleLoginModalCancel: () => {},
  hideLink: false,
  isButton: false,
  setIsShowSignInModal: () => {},
  toCurrentWobjLink: '',
  history: {},
};

export default connect(state => ({
  host: getAppHost(state),
  domain: getWebsiteParentHost(state),
  isWaivio: getIsWaivio(state),
  usedLocale: getUsedLocale(state),
  websiteName: getWebsiteNameForHeader(state),
}))(injectIntl(ModalSignIn));
