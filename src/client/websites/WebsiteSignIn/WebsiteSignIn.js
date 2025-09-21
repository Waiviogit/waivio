import React, { useEffect, useState } from 'react';
import hivesigner from 'hivesigner';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { message } from 'antd';

import { batch, useDispatch } from 'react-redux';
import { setGuestLoginData } from '../../../common/helpers/localStorageHelpers';
import { isUserRegistered } from '../../../waivioApi/ApiClient';
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
import { hexToRgb, setGoogleTagEvent } from '../../../common/helpers';

import SocialSignInModalContent from './SocialSingInModalContent/SocialSignInModalContent';
import WebsiteSignInModalContent from './WebsiteSignInModalContent/WebsiteSignInModalContent';

const WebsiteSignIn = props => {
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const query = new URLSearchParams(props.location.search);
  const websiteName = query.get('websiteName');
  const websiteTitle = websiteName
    ? websiteName.replace('http://', '').replace('https://', '')
    : location.hostname;
  let callbackURL = `https://${props.url}/callback`;

  if (props?.url?.includes('localhost') && typeof location !== 'undefined') {
    callbackURL = `${location.origin}/callback`;
  }

  const hiveSigner = new hivesigner.Client({
    app: process.env.STEEMCONNECT_CLIENT_ID,
    callbackURL,
  });

  useEffect(() => {
    if (query.get('color')) {
      const color = `#${query.get('color')}`;

      if (typeof document !== 'undefined') {
        document.body.style.setProperty('--website-color', color);
        document.body.style.setProperty('--website-hover-color', hexToRgb(color, 8));
      }
    }
  }, [query]);

  const onClickHiveSignerAuthButton = () => {
    setGoogleTagEvent('click_sign_in_hivesigner');
    window.location.href = hiveSigner.getLoginURL();
  };

  const responseSocial = async (response, socialNetwork) => {
    setIsLoading(true);
    setGoogleTagEvent('click_sign_in_google');

    if (response?.error || (socialNetwork === 'facebook' && isEmpty(response.id))) {
      setIsLoading(false);
    } else if (response) {
      const id = socialNetwork === 'google' ? response.googleId : response.id;
      const res = await isUserRegistered(id, socialNetwork);

      if (res) {
        setGuestLoginData(response.accessToken, socialNetwork, id);
        if (query.get('host')) {
          if (typeof window !== 'undefined')
            window.location.href = `https://${props.url}/?access_token=${response.accessToken}&socialProvider=${socialNetwork}`;
        } else {
          if (typeof window !== 'undefined' && window.gtag)
            window.gtag('event', `login_${socialNetwork}`, { debug_mode: false });
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
    if (failResponse?.error === 'idpiframe_initialization_failed') {
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
      setIsModalOpen={props.setIsModalOpen}
      loading={loading}
      hiveSigner={hiveSigner}
      websiteName={props.url}
      showCloseIcon={props.showCloseIcon}
      onClickHiveSignerAuthButton={onClickHiveSignerAuthButton}
    />
  ) : (
    <WebsiteSignInModalContent
      responseSocial={responseSocial}
      handleFailure={handleFailure}
      loading={loading}
      hiveSigner={hiveSigner}
      onClickHiveSignerAuthButton={onClickHiveSignerAuthButton}
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
  showCloseIcon: PropTypes.bool,
  url: PropTypes.string,
  setIsFormVisible: PropTypes.func.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

WebsiteSignIn.defaultProps = {
  showCloseIcon: false,
};

export default withRouter(injectIntl(WebsiteSignIn));
