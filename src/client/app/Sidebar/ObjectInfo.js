import React from 'react';
import PropTypes from 'prop-types';
import urlParse from 'url-parse';

import { getField } from '../../objects/WaivioObject';

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
        </div>
      )}
    </div>
  );
};

ObjectInfo.propTypes = {
  wobject: PropTypes.shape().isRequired,
};

export default ObjectInfo;
