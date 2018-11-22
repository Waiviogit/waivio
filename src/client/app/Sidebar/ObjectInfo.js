import React from 'react';
import PropTypes from 'prop-types';
import urlParse from 'url-parse';
import _ from 'lodash';

import { getField } from '../../objects/WaivioObject';
import SocialLinks from '../../components/SocialLinks';

export const truncate = str => {
  if (str && str.length > 150) return `${str.substring(0, 150)}...`;
  return str;
};

const ObjectInfo = props => {
  const { wobject } = props;

  const location = wobject && getField(wobject, 'locationAccomodation');
  const descriptionFull = wobject && truncate(getField(wobject, 'descriptionFull'));

  let website = wobject && getField(wobject, 'link');

  if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
    website = `http://${website}`;
  }
  const url = urlParse(website);
  let hostWithoutWWW = url.host;

  if (hostWithoutWWW.indexOf('www.') === 0) {
    hostWithoutWWW = hostWithoutWWW.slice(4);
  }

  let facebook = wobject && getField(wobject, 'linkFacebook');
  if (facebook) {
    facebook = facebook.split('/')[3];
  }

  let twitter = wobject && getField(wobject, 'linkTwitter');
  if (twitter) {
    twitter = twitter.split('/')[3];
  }

  let linkedin = wobject && getField(wobject, 'linkLinkedIn');
  if (linkedin) {
    linkedin = linkedin.split('/')[4];
  }

  let youtube = wobject && getField(wobject, 'linkYoutube');
  if (youtube) {
    youtube = youtube.split('/')[4];
  }

  let instagram = wobject && getField(wobject, 'linkInstagram');
  if (instagram) {
    instagram = instagram.split('/')[3];
  }

  let github = wobject && getField(wobject, 'linkGithub');
  if (github) {
    github = github.split('/')[3];
  }

  let bitcoin = wobject && getField(wobject, 'linkBitCoin');
  if (bitcoin) {
    bitcoin = bitcoin.split('/')[3];
  }

  let ethereum = wobject && getField(wobject, 'linkEthereum');
  if (ethereum) {
    ethereum = ethereum.split('/')[3];
  }

  let vkontakte = wobject && getField(wobject, 'linkVk');
  if (vkontakte) {
    vkontakte = vkontakte.split('/')[3];
  }

  const profileLinks = {
    facebook,
    twitter,
    linkedin,
    youtube,
    instagram,
    github,
    bitcoin,
    ethereum,
    vkontakte,
  };

  const profile = _.pickBy(profileLinks, _.identity);

  return (
    <div>
      {wobject.tag && (
        <div style={{ wordBreak: 'break-word' }}>
          <div style={{ fontSize: '18px' }}>{wobject && descriptionFull}</div>
          <div style={{ marginTop: 16, marginBottom: 16 }}>
            {location && (
              <div>
                <i className="iconfont icon-coordinates text-icon" />
                {location}
              </div>
            )}
            {website && (
              <div>
                <i className="iconfont icon-link text-icon" />
                <a target="_blank" rel="noopener noreferrer" href={website}>
                  {`${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`}
                </a>
              </div>
            )}
          </div>
          <SocialLinks profile={profile} />
        </div>
      )}
    </div>
  );
};

ObjectInfo.propTypes = {
  wobject: PropTypes.shape().isRequired,
};

export default ObjectInfo;
