import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { includes, truncate, get } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RatingsWrap from './RatingsWrap/RatingsWrap';
import WeightTag from '../components/WeightTag';
import DEFAULTS from '../object/const/defaultValues';
import { getAuthenticatedUserName, getScreenSize } from '../reducers';
import { getObjectName, parseAddress, getObjectAvatar } from '../helpers/wObjectHelper';
import { getProxyImageURL } from '../helpers/image';

import './ObjectCardView.less';

const ObjectCardView = ({
  intl,
  wObject,
  options: { mobileView = 'compact', ownRatesOnly = false },
}) => {
  const screenSize = useSelector(getScreenSize);
  const username = useSelector(getAuthenticatedUserName);
  const [tags, setTags] = useState([]);
  const address = parseAddress(wObject);
  const parent = get(wObject, 'parent', {});

  useEffect(() => {
    const objectTags = get(wObject, 'topTags', []);
    setTags([wObject.object_type, ...objectTags]);
  }, [wObject.author_permlink, setTags]);

  const pathName = wObject.defaultShowLink || `/object/${wObject.author_permlink}`;

  const avatarLayout = () => {
    let url = getObjectAvatar(wObject) || getObjectAvatar(parent);

    if (url) url = getProxyImageURL(url, 'preview');
    else url = DEFAULTS.AVATAR;

    if (includes(url, 'waivio.')) url = `${url}_medium`;

    return (
      <div
        className="avatar-image"
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    );
  };
  const objName = getObjectName(wObject);
  const parentName = getObjectName(parent);
  const description = wObject.description && (
    <div className="ObjectCardView__title" title={wObject.description}>
      {truncate(wObject.description, {
        length: 140,
        separator: ' ',
      })}
    </div>
  );
  const goToObjTitle = wobjName =>
    `${intl.formatMessage({
      id: 'GoTo',
      defaultMessage: 'Go to',
    })} ${wobjName}`;

  const parentLink = get(parent, 'defaultShowLink');

  return (
    <div key={wObject.author_permlink}>
      <div className="ObjectCardView">
        <div className="ObjectCardView__content">
          <div className="ObjectCardView__content-row">
            <Link
              to={pathName}
              title={goToObjTitle(objName)}
              className="ObjectCardView__avatar"
              key={wObject.author_permlink}
            >
              {avatarLayout()}
            </Link>
            <div className="ObjectCardView__info">
              {parentName && (
                <Link
                  to={parentLink}
                  title={goToObjTitle(parentName)}
                  className="ObjectCardView__type"
                >
                  {parentName}
                </Link>
              )}
              <div className="ObjectCardView__name">
                <Link
                  key={wObject.author_permlink}
                  to={pathName}
                  className="ObjectCardView__name-truncated"
                  title={goToObjTitle(objName)}
                >
                  {objName}
                </Link>
                {!isNaN(wObject.weight) && <WeightTag weight={Number(wObject.weight)} />}
              </div>
              {wObject.rating && (
                <RatingsWrap
                  mobileView={mobileView}
                  ownRatesOnly={ownRatesOnly}
                  ratings={wObject.rating}
                  screenSize={screenSize}
                  username={username}
                  wobjId={wObject.id || wObject.author_permlink}
                  wobjName={objName}
                />
              )}
              <span className="ObjectCardView__tag-text">
                {wObject.price && (
                  <span className="ObjectCardView__price" title={wObject.price}>
                    {wObject.price}
                  </span>
                )}
                {tags.map((tag, index) => (
                  <span key={tag}>
                    {index === 0 && !wObject.price ? tag : <span>&nbsp;&middot;{` ${tag}`}</span>}
                  </span>
                ))}
              </span>
              {address && <div className="ObjectCardView__tag-text">{address}</div>}
              {wObject.title ? (
                <div className="ObjectCardView__title" title={wObject.title}>
                  {truncate(wObject.title, {
                    length: 140,
                    separator: ' ',
                  })}
                </div>
              ) : (
                description
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ObjectCardView.propTypes = {
  intl: PropTypes.shape().isRequired,
  wObject: PropTypes.shape(),
  options: PropTypes.shape({
    mobileView: PropTypes.oneOf(['compact', 'full']),
    ownRatesOnly: PropTypes.bool,
    pathNameAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  }),
};

ObjectCardView.defaultProps = {
  options: {},
  wObject: {},
};
export default injectIntl(ObjectCardView);
