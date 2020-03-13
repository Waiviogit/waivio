import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { batch, useDispatch } from 'react-redux';
import { injectIntl } from 'react-intl';
import SteemConnect from '../../../steemConnectAPI';
import { login, busyLogin } from '../../../auth/authActions';
import { isUserRegistered } from '../../../../waivioApi/ApiClient';
import { getFollowing, getFollowingObjects, getNotifications } from '../../../user/userActions';
import { getRate, getRewardFund } from './../../../app/appActions';
import { getRebloggedList } from './../../../app/Reblog/reblogActions';
import GuestSignUpForm from '../GuestSignUpForm/GuestSignUpForm';
import Spinner from '../../Icon/Loading';
import SocialButtons from '../SocialButtons/SocialButtons';

import './ModalSignIn.less';

const ModalSignIn = ({ next, intl }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const responseSocial = async (response, socialNetwork) => {
    if (response) {
      const id = socialNetwork === 'google' ? response.googleId : response.id;
      const res = await isUserRegistered(id, socialNetwork);
      if (res) {
        setIsLoading(true);
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

  const renderSignIn = () => (
    <React.Fragment>
      <h2 className="ModalSignIn__title">
        {intl.formatMessage({
          id: 'login',
          defaultMessage: 'Log in',
        })}
      </h2>
      {isLoading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <p className="ModalSignIn__rules">
            {intl.formatMessage({
              id: 'sing_in_modal_message',
              defaultMessage: 'Waivio is powered by Steem open social blockchain',
            })}
          </p>
          <p className="ModalSignIn__title ModalSignIn__title--lined">
            <span>
              {intl.formatMessage({
                id: 'steem_accounts',
                defaultMessage: 'STEEM ACCOUNTS',
              })}
            </span>
          </p>
          <a role="button" href={SteemConnect.getLoginURL(next)} className="ModalSignIn__signin">
            <img
              src="/images/icons/steemit.svg"
              alt="steemit"
              className="ModalSignIn__icon-steemit"
            />
            {intl.formatMessage({
              id: 'signin_with_steemIt',
              defaultMessage: 'SteemConnect',
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
          <SocialButtons className="ModalSignIn__social" responseSocial={responseSocial} />
          <p className="ModalSignIn__rules">
            {intl.formatMessage({
              id: 'sing_in_modal_rules',
              defaultMessage: 'By using this Service, you agree to be bound by',
            })}
            &ensp;
            <a
              href="https://www.waivio.com/object/ylr-waivio/menu#oxa-legal/xrj-terms-and-conditions"
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
              href="https://www.waivio.com/object/ylr-waivio/menu#oxa-legal/poi-privacy-policy"
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
              href="https://www.waivio.com/object/ylr-waivio/menu#oxa-legal/uid-cookies-policy"
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
    </React.Fragment>
  );

  const onModalClose = () => {
    setIsModalOpen(false);
    setIsFormVisible(false);
  };

  const memoizedOnModalClose = useCallback(() => {
    onModalClose();
  }, []);

  return (
    <React.Fragment>
      <a role="presentation" onClick={() => setIsModalOpen(true)}>
        {intl.formatMessage({
          id: 'signin',
          defaultMessage: 'Log in',
        })}
      </a>
      <Modal width={480} visible={isModalOpen} onCancel={memoizedOnModalClose} footer={null}>
        <div className="ModalSignIn">
          {isFormVisible ? (
            <GuestSignUpForm userData={userData} isModalOpen={isModalOpen} />
          ) : (
            renderSignIn()
          )}
        </div>
      </Modal>
    </React.Fragment>
  );
};

ModalSignIn.propTypes = {
  next: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

ModalSignIn.defaultProps = {
  next: '',
};

export default injectIntl(ModalSignIn);
