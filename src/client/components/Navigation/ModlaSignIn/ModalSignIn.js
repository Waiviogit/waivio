import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { batch, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import SteemConnect from '../../../steemConnectAPI';
import { login, busyLogin } from '../../../auth/authActions';
import { isUserRegistered } from '../../../../waivioApi/ApiClient';
import { getFollowing, getFollowingObjects, getNotifications } from '../../../user/userActions';
import { getRate, getRewardFund } from './../../../app/appActions';
import { getRebloggedList } from './../../../app/Reblog/reblogActions';
import GuestSignUpForm from '../GuestSignUpForm/GuestSignUpForm';
import Spinner from '../../Icon/Loading';
import SocialButtons from '../SocialButtons/SocialButtons';

import '../ModalSignUp/ModalSignUp.less';

const ModalSignIn = ({ next }) => {
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
      <h2 className="ModalSignUp__title">
        <FormattedMessage id="login" defaultMessage="Log in" />
      </h2>
      {isLoading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <a role="button" href={SteemConnect.getLoginURL(next)} className="ModalSignUp__signin">
            <img
              src="/images/icons/steemit.svg"
              alt="steemit"
              className="ModalSignUp__icon-steemit"
            />
            <FormattedMessage id="signin_with_steemIt" defaultMessage="SteemConnect" />
          </a>
          <SocialButtons responseSocial={responseSocial} />
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
        <FormattedMessage id="signin" defaultMessage="Log in" />
      </a>
      <Modal width={416} visible={isModalOpen} onCancel={memoizedOnModalClose} footer={null}>
        <div className="ModalSignUp">
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
};

ModalSignIn.defaultProps = {
  next: '',
};

export default ModalSignIn;
