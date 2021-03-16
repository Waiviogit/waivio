import React, { useState } from 'react';
import hivesigner from 'hivesigner';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import Spinner from '../../Icon/Loading';
import SocialButtons from '../SocialButtons/SocialButtons';
import { setGuestLoginData, getSiteURL, getNext } from '../../../helpers/localStorageHelpers';
import { isUserRegistered } from '../../../../waivioApi/ApiClient';
import GuestSignUpForm from '../GuestSignUpForm/GuestSignUpForm';

import './RedirectedSignIn.less';

const RedirectedSignIn = () => {
  const next = getNext();

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const url = getSiteURL();

  const hiveSinger = new hivesigner.Client({
    app: process.env.STEEMCONNECT_CLIENT_ID,
    callbackURL: `https://${url}/callback`,
  });

  const responseSocial = async (response, socialNetwork) => {
    setIsLoading(true);

    if (response.error || (socialNetwork === 'facebook' && isEmpty(response.id))) {
      setIsLoading(false);
    } else if (response) {
      const id = socialNetwork === 'google' ? response.googleId : response.id;
      const res = await isUserRegistered(id, socialNetwork);
      if (res) {
        setGuestLoginData(response.accessToken, socialNetwork, id);
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
        setIsModalOpen(true);
      }
      if (!isModalOpen) {
        window.location.href(`https://${url}`);
      }
    }
  };

  const handleClickLoading = () => {
    setIsLoading(true);
  };

  const renderSignIn = () => (
    <React.Fragment>
      <div className="RedirectedSignIn">
        {isLoading ? (
          <h2 className="RedirectedSignIn__loading">
            <FormattedMessage id="signing" defaultMessage="Signing in!" />
          </h2>
        ) : (
          <h2 className="RedirectedSignIn__title">
            <FormattedMessage id="signinForRewards" defaultMessage="Sign in for rewards!" />
          </h2>
        )}
        {isLoading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <p className="RedirectedSignIn__rules">
              <FormattedMessage
                id="sing_in_modal_message"
                defaultMessage="Waivio is powered by the Hive open social blockchain"
              />
            </p>
            <p className="RedirectedSignIn__title RedirectedSignIn__title--lined">
              <span>
                <FormattedMessage id="steem_accounts" defaultMessage="HIVE ACCOUNTS" />
              </span>
            </p>
            <a
              role="button"
              href={hiveSinger.getLoginURL(next)}
              className="RedirectedSignIn__signin"
            >
              <img
                src="/images/icons/logo-hive.svg"
                alt="hive"
                className="RedirectedSignIn__icon-steemit"
              />
              <FormattedMessage id="signin_with_steemIt" defaultMessage="HiveSinger" />
            </a>
            <p className="RedirectedSignIn__title RedirectedSignIn__title--lined">
              <span>
                <FormattedMessage id="guestAccounts" defaultMessage="GUEST ACCOUNTS" />
              </span>
            </p>
            <div onClick={handleClickLoading} role="presentation">
              <SocialButtons className="RedirectedSignIn__social" responseSocial={responseSocial} />
            </div>
            <p className="RedirectedSignIn__rules">
              <FormattedMessage
                id="sing_in_modal_rules"
                defaultMessage="By using this Service, you agree to be bound by"
              />
              &ensp;
              <a
                href="https://www.waivio.com/object/ylr-waivio/menu#oxa-legal/xrj-terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage
                  id="terms_and_conditions"
                  defaultMessage="the Terms and Conditions"
                />
              </a>
              ,&ensp;
              <a
                href="https://www.waivio.com/object/ylr-waivio/menu#oxa-legal/poi-privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id="privacy_policy" defaultMessage="the Privacy Policy" />
              </a>
              ,&ensp;
              <a
                href="https://www.waivio.com/object/ylr-waivio/menu#oxa-legal/uid-cookies-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id="cookies_policy" defaultMessage="the Cookies Policy" />
              </a>
              .
            </p>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );

  const renderGuestSignUpForm = () => (
    <React.Fragment>
      <div className="ModalGuestForm">
        <GuestSignUpForm userData={userData} isModalOpen={isModalOpen} />
      </div>
    </React.Fragment>
  );

  return <div className="Wrapper">{isFormVisible ? renderGuestSignUpForm() : renderSignIn()}</div>;
};

RedirectedSignIn.propTypes = {};

RedirectedSignIn.defaultProps = {};

export default RedirectedSignIn;
