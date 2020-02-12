import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form } from 'antd';
import { batch, useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { busyLogin, login } from '../../../auth/authActions';
import { isUserRegistered } from '../../../../waivioApi/ApiClient';
import { getFollowing, getFollowingObjects, getNotifications } from '../../../user/userActions';
import { getRate, getRewardFund } from './../../../app/appActions';
import { getRebloggedList } from './../../../app/Reblog/reblogActions';
import GuestSignUpForm from '../GuestSignUpForm/GuestSignUpForm';
import SocialButtons from '../SocialButtons/SocialButtons';
import Spinner from '../../Icon/Loading';
import SignUpInfo from '../SignUpInfo/SignUpInfo';
import SteemSignUpCard from '../SteemSignUpCard/SteemSignUpCard';
import SignUpButton from '../SignUpButton/SignUpButton';
import './ModalSignUp.less';

const ModalSignUp = ({ isButton }) => {
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
        const image = socialNetwork === 'google' ? response.w3.Paa : response.picture.data.url;
        setUserData({ ...response, image, socialNetwork });
        setIsFormVisible(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsFormVisible(false);
  };

  const memoizedSetIsModalOpen = useCallback(() => setIsModalOpen(true), []);
  const memoizedHandleCloseModal = useCallback(() => handleCloseModal(), []);

  const renderSignUp = () => (
    <React.Fragment>
      <h2 className="ModalSignUp__title">
        <FormattedMessage id="signUp" defaultMessage="Sign up!" />
      </h2>
      {isLoading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <SteemSignUpCard />
          <SignUpInfo />
          <SocialButtons responseSocial={responseSocial} />
        </React.Fragment>
      )}
      {/* Waiting for Grampo agreement */}
      {/* <h2 className="ModalSignUp__title ModalSignUp__title--lined ModalSignUp__title ModalSignUp__title--lined--lined"> */}
      {/*  <span> */}
      {/*    <FormattedMessage id="steemAccounts" defaultMessage="STEEM ACCOUNTS" /> */}
      {/*  </span> */}
      {/* </h2> */}
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <SignUpButton isButton={isButton} setIsModalOpen={memoizedSetIsModalOpen} />
      <Modal
        width={416}
        title=""
        visible={isModalOpen}
        onCancel={memoizedHandleCloseModal}
        footer={null}
      >
        <div className="ModalSignUp">
          {isFormVisible ? (
            <GuestSignUpForm userData={userData} isModalOpen={isModalOpen} />
          ) : (
            renderSignUp()
          )}
        </div>
      </Modal>
    </React.Fragment>
  );
};

ModalSignUp.propTypes = {
  isButton: PropTypes.bool.isRequired,
};

export default Form.create({ name: 'user_name' })(injectIntl(ModalSignUp));
