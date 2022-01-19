import React, { useState } from 'react';
import hivesigner from 'hivesigner';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { message } from 'antd';

import { batch, useDispatch, useSelector } from 'react-redux';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { setGuestLoginData } from '../../helpers/localStorageHelpers';
import { isUserRegistered } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import SocialButton from './SocialButton';
import { getCurrentHost } from '../../../store/appStore/appSelectors';
import {
  getFollowing,
  getFollowingObjects,
  getNotifications,
} from '../../../store/userStore/userActions';
import { busyLogin, getAuthGuestBalance, login } from '../../../store/authStore/authActions';
import { getRate, getRewardFund } from '../../../store/appStore/appActions';
import { getRebloggedList } from '../../../store/reblogStore/reblogActions';
import styles from './styles';
import './WebsiteSignIn.less';

const WebsiteSignIn = props => {
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const currentHost = useSelector(getCurrentHost);
  const query = new URLSearchParams(props.location.search);
  const url = query.get('host') || currentHost + location.pathname;
  const urlObj = new URL(url);
  const hiveSinger = new hivesigner.Client({
    app: process.env.STEEMCONNECT_CLIENT_ID,
    callbackURL: `${urlObj.origin}/callback`,
  });

  const onClickHiveSingerAuthButton = () => {
    if (window.gtag) window.gtag('event', 'login_hive_singer');
  };

  const responseSocial = async (response, socialNetwork) => {
    setIsLoading(true);

    if (response.error || (socialNetwork === 'facebook' && isEmpty(response.id))) {
      setIsLoading(false);
    } else if (response) {
      const id = socialNetwork === 'google' ? response.googleId : response.id;
      const res = await isUserRegistered(id, socialNetwork);

      if (res) {
        setGuestLoginData(response.accessToken, socialNetwork, id);
        if (query.get('host')) {
          window.location.href = `${url}/?access_token=${response.accessToken}&socialProvider=${socialNetwork}`;
        } else {
          if (window.gtag) window.gtag('event', `login_${socialNetwork}`);
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
            });
          });
        }
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
        props.setUserData({ ...response, image, socialNetwork });
        props.setIsFormVisible(true);
      }
    }
  };

  const handleFailure = failResponse => {
    if (failResponse.error === 'idpiframe_initialization_failed') {
      message.error(
        props.intl.formatMessage({
          id: 'sign_in_error_not_cookies',
          defaultMessage:
            'You need to disable blocking cookies in incognito mode, in your browser settings',
        }),
      );
    } else {
      responseSocial(failResponse, 'google');
    }
  };

  return (
    <div
      className="WebsiteSignIn"
      style={{
        width: '440px',
        borderRadius: '4px',
        boxShadow: '0px 0px 12px 2px rgba(34, 60, 80, 0.2)',
      }}
    >
      <div style={styles.formHeader}>
        <h1 style={{ ...styles.mainTitle, ...styles.resetTitleStyles }}>
          {props.intl.formatMessage({
            id: 'eat_out_earn_crypto',
            defaultMessage: 'eat out, earn crypto',
          })}
          .
        </h1>
        <h2
          style={{
            color: '#f86b26',
            ...styles.resetTitleStyles,
          }}
        >
          {props.intl.formatMessage({
            id: 'sign_in_for_reward',
            defaultMessage: 'Sign-In for rewards per meal',
          })}
          .
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
              {props.intl.formatMessage({ id: 'get_a_free', defaultMessage: 'get a free' })}{' '}
              <i>
                {props.intl.formatMessage({
                  id: 'full_featured',
                  defaultMessage: 'full-featured',
                })}
              </i>{' '}
              {props.intl.formatMessage({ id: 'account', defaultMessage: 'account' })}
            </h3>
            <SocialButton
              socialNetwork={'HiveSinger'}
              size={'28px'}
              href={hiveSinger.getLoginURL()}
              onClick={onClickHiveSingerAuthButton}
            />
            <p>
              {props.intl.formatMessage({
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
                {props.intl.formatMessage({ id: 'click_here', defaultMessage: 'Click here' })}.
              </a>
            </p>
            <p className="WebsiteSignIn__or">
              {props.intl.formatMessage({ id: 'or', defaultMessage: 'or' })}
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
              {props.intl.formatMessage({ id: 'get_a_free', defaultMessage: 'get a free' })}{' '}
              <i>{props.intl.formatMessage({ id: 'guest', defaultMessage: 'guest' })}</i>{' '}
              {props.intl.formatMessage({ id: 'account', defaultMessage: 'account' })}
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
              <FacebookLogin
                appId="754038848413420"
                autoLoad={false}
                callback={response => responseSocial(response, 'facebook')}
                disableMobileRedirect
                render={renderProps => (
                  <SocialButton
                    socialNetwork={'Facebook'}
                    onClick={renderProps.onClick}
                    size={'30px'}
                  />
                )}
              />
            </div>
            <p
              style={{
                fontSize: '14px',
                textAlign: 'center',
                marginTop: '25px',
              }}
            >
              {props.intl.formatMessage({
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
};

WebsiteSignIn.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  setUserData: PropTypes.func.isRequired,
  setIsFormVisible: PropTypes.func.isRequired,
};

export default withRouter(injectIntl(WebsiteSignIn));
