import React, { useEffect, useState } from 'react';
import hivesigner from 'hivesigner';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { message } from 'antd';

import { batch, useDispatch, useSelector } from 'react-redux';
import { setGuestLoginData } from '../../../common/helpers/localStorageHelpers';
import { isUserRegistered } from '../../../waivioApi/ApiClient';
import { getCurrentHost } from '../../../store/appStore/appSelectors';
import {
  getFollowing,
  getFollowingObjects,
  getNotifications,
} from '../../../store/userStore/userActions';
import {
  busyLogin,
  changeRewardsTab,
  getAuthGuestBalance,
  login,
} from '../../../store/authStore/authActions';
import { getRate, getRewardFund } from '../../../store/appStore/appActions';
import { getRebloggedList } from '../../../store/reblogStore/reblogActions';
import { hexToRgb } from '../../../common/helpers';

import SocialSignInModalContent from './SocialSingInModalContent/SocialSignInModalContent';
import WebsiteSignInModalContent from './WebsiteSignInModalContent/WebsiteSignInModalContent';

const WebsiteSignIn = props => {
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const currentHost = useSelector(getCurrentHost);
  const query = new URLSearchParams(props.location.search);
  const websiteName = query.get('websiteName');
  const websiteTitle = websiteName
    ? websiteName.replace('http://', '').replace('https://', '')
    : location.hostname;
  const url = query.get('host') || currentHost + location.pathname;
  const urlObj = new URL(url);
  const hiveSinger = new hivesigner.Client({
    app: process.env.STEEMCONNECT_CLIENT_ID,
    callbackURL: `${urlObj.origin}/callback`,
  });

  useEffect(() => {
    if (query.get('color')) {
      const color = `#${query.get('color')}`;

      document.body.style.setProperty('--website-color', color);
      document.body.style.setProperty('--website-hover-color', hexToRgb(color, 8));
    }
  }, []);

  const onClickHiveSingerAuthButton = () => {
    if (window.gtag) window.gtag('event', 'login_hive_singer', { debug_mode: true });
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
          if (window.gtag) window.gtag('event', `login_${socialNetwork}`, { debug_mode: true });
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

  return props.isSocial ? (
    <SocialSignInModalContent
      websiteTitle={websiteTitle}
      responseSocial={responseSocial}
      handleFailure={handleFailure}
      loading={loading}
      hiveSinger={hiveSinger}
      onClickHiveSingerAuthButton={onClickHiveSingerAuthButton}
    />
  ) : (
    <WebsiteSignInModalContent
      responseSocial={responseSocial}
      handleFailure={handleFailure}
      loading={loading}
      hiveSinger={hiveSinger}
      onClickHiveSingerAuthButton={onClickHiveSingerAuthButton}
    />
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
  isSocial: PropTypes.bool,
  setIsFormVisible: PropTypes.func.isRequired,
};

export default withRouter(injectIntl(WebsiteSignIn));
