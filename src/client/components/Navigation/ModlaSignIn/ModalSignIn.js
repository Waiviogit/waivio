import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import hivesigner from 'hivesigner';
import { batch, connect, useDispatch } from 'react-redux';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
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
import SocialButtons from '../SocialButtons/SocialButtons';
import SignUpButton from '../SignUpButton/SignUpButton';
import {
  clearAllSessionProposition,
  getSessionData,
  removeSessionData,
} from '../../../rewards/rewardsHelper';
import {
  getCurrentHost,
  getIsWaivio,
  getWebsiteParentHost,
} from '../../../../store/appStore/appSelectors';
import WebsiteSignIn from '../../../websites/WebsiteSignIn/WebsiteSignIn';

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
  currHost,
  isWaivio,
  domain,
}) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = React.useState('');
  let host = currHost;

  if (!host && typeof location !== 'undefined') host = location.host;

  const hiveSinger = new hivesigner.Client({
    app: process.env.STEEMCONNECT_CLIENT_ID,
    callbackURL: `${host}/callback`,
  });
  const isWidget = getSessionData('isWidget');

  useEffect(() => {
    if (showModal) setIsModalOpen(true);
  }, [showModal]);

  const responseSocial = async (response, socialNetwork) => {
    setIsLoading(true);

    if (response.error || (socialNetwork === 'facebook' && isEmpty(response.id))) {
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
    if (lastError !== 'idpiframe_initialization_failed') {
      setIsLoading(true);
    }
  };

  const renderGuestSignUpForm = () => (
    <div className="ModalGuestForm">
      <GuestSignUpForm userData={userData} isModalOpen={isModalOpen} />
    </div>
  );

  const renderSignIn = () => {
    if (!isWaivio)
      return <WebsiteSignIn setUserData={setUserData} setIsFormVisible={setIsFormVisible} />;

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
              <a role="button" href={hiveSinger.getLoginURL()} className="ModalSignIn__signin">
                <img
                  src="/images/icons/logo-hive.svg"
                  alt="hive"
                  className="ModalSignIn__icon-steemit"
                />
                {intl.formatMessage({
                  id: 'signin_with_steemIt',
                  defaultMessage: 'HiveSinger',
                })}
              </a>
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
  };

  const onSignUpClick = isOpen => {
    if (!isWaivio && domain) {
      window.location.href = `https://${domain}/sign-in?host=${host}`;
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
  }, []);

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
  isButton: PropTypes.bool,
  setIsShowSignInModal: PropTypes.func,
  toCurrentWobjLink: PropTypes.string,
  buttonClassName: PropTypes.string,
  history: PropTypes.shape(),
  currHost: PropTypes.string.isRequired,
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
  currHost: getCurrentHost(state),
  domain: getWebsiteParentHost(state),
  isWaivio: getIsWaivio(state),
}))(injectIntl(ModalSignIn));
