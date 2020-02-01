import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Form, Icon, Modal} from 'antd';
import {batch, useDispatch} from 'react-redux';
import {FormattedMessage, injectIntl} from 'react-intl';
import {GoogleLogin} from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import {busyLogin, login} from '../../../auth/authActions';
import {isUserRegistered} from '../../../../waivioApi/ApiClient';
import {getFollowing, getFollowingObjects, getNotifications} from '../../../user/userActions';
import {getRate, getRewardFund} from './../../../app/appActions';
import {getRebloggedList} from './../../../app/Reblog/reblogActions';
import GuestSignUpForm from '../GuestSignUpForm/GuestSignUpForm';
import './ModalSignUp.less';

const ModalSignUp = ({isButton}) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

  const responseGoogle = async response => {
    if (response) {
      const res = await isUserRegistered(response.googleId, 'google');
      if (res) {
        dispatch(login(response.accessToken, 'google')).then(() => {
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
        setUserData({...response, socialNetwork: 'google'});
        setIsFormVisible(true);
      }
    }
  };

  const responseFacebook = async response => {
    if (response) {
      const res = await isUserRegistered(response.id, 'facebook');
      if (res) {
        dispatch(login(response.accessToken, 'facebook')).then(() => {
          batch(() => {
            dispatch(getFollowing());
            dispatch(getFollowingObjects());
            dispatch(getNotifications());
            dispatch(busyLogin());
          });
        });
      } else {
        setUserData({...response, socialNetwork: 'facebook'});
        setIsFormVisible(true);
      }
    }
  };

  const getSignUpInfo = (
    <div className="SignUpCard">
      <div className="SignUpCard__line">
        <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
          <img
            alt="linkLogo"
            src="https://cdn.steemitimages.com/DQmernVC8CUupAFckxvE62oMYVJNAsK8YDLmyBzJnNLzH7S/steemit.png"
          />
        </a>
      </div>
      <div className="ModalSignUp__link mb3">
        <FormattedMessage id="freeSteemAcc" defaultMessage="- get a free Steem account"/>
        <FormattedMessage id="emailAndPhoneReq" defaultMessage="- email & phone required"/>
        <FormattedMessage id="longerWaiting" defaultMessage="- wait up to 2 weeks"/>
      </div>
      <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
        <FormattedMessage id="signup" defaultMessage="Sign up"/>
      </a>
    </div>
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderSignUp = () => (
    <React.Fragment>
      <h2 className="ModalSignUp__title">
        <FormattedMessage id="signupForRewards" defaultMessage="Sign up for rewards!"/>
      </h2>
      {/* <h2 className="ModalSignUp__title ModalSignUp__title--lined ModalSignUp__title ModalSignUp__title--lined--lined"> */}
      {/*  <span> */}
      {/*    <FormattedMessage id="steemAccounts" defaultMessage="STEEM ACCOUNTS" /> */}
      {/*  </span> */}
      {/* </h2> */}
      {getSignUpInfo}
      <div className="ModalSignUp__subtitle">
        <FormattedMessage id="payOneTimeFee" defaultMessage="or pay a one-time fee (about $3)"/>
        <FormattedMessage
          id="getSteemAccountNow"
          defaultMessage="to get a Steem account now using:"
        />
      </div>
      <div className="mb3">
        <a
          href="https://steemwallet.app/widget/widget.html"
          className="ModalSignUp__link"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FormattedMessage id="creditCards" defaultMessage="- credit cards"/>
        </a>
        <a
          href="https://blocktrades.us/create-steem-account"
          className="ModalSignUp__link"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FormattedMessage id="BTC_LTC_ETH" defaultMessage="- BTC/LTC/ETH"/>
        </a>
        <a
          href="https://v2.steemconnect.com/accounts/create"
          className="ModalSignUp__link"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FormattedMessage id="STEEMcoins" defaultMessage="- STEEM coins"/>
        </a>
      </div>
      <h2 className="ModalSignUp__title ModalSignUp__title--lined">
        <span>
          <FormattedMessage id="guestAccounts" defaultMessage="GUEST ACCOUNTS"/>
        </span>
      </h2>

      <div className="ModalSignUp__subtitle">
        <FormattedMessage
          id="lookAroundgetRewardsMakeConnections"
          defaultMessage="Look around, get rewards, make connections,"
        />
        <FormattedMessage
          id="createSteemAccountLater"
          defaultMessage="create a Steem account later"
        />
      </div>
      <div className="ModalSignUp__social mt3">
        <GoogleLogin
          buttonText="Google"
          clientId="623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com"
          onSuccess={responseGoogle}
          cookiePolicy={'single_host_origin'}
          onFailure={() => {
          }}
          className="ModalSignUp__social-btn"
        />
        <FacebookLogin
          appId="754038848413420"
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          onFailure={() => {
          }}
          textButton="Facebook"
          cssClass="ModalSignUp__social-btn ModalSignUp__social-btn--fb"
          icon={<Icon type="facebook" className="ModalSignUp__icon-fb"/>}
        />
      </div>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {isButton ? (
        <button onClick={() => setIsModalOpen(true)} className="ModalSignUp__button">
          <FormattedMessage id="signup" defaultMessage="Sign up"/>
        </button>
      ) : (
        <a role="presentation" onClick={() => setIsModalOpen(true)}>
          <FormattedMessage id="signup" defaultMessage="Sign up"/>
        </a>
      )}
      <Modal width={416} title="" visible={isModalOpen} onCancel={handleCloseModal} footer={null}>
        <div className="ModalSignUp">
          {isFormVisible ? (
            <GuestSignUpForm userData={userData} isModalOpen={isModalOpen}/>
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

export default Form.create({name: 'user_name'})(injectIntl(ModalSignUp));
