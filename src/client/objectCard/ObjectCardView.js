import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { includes, orderBy, truncate, get, isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RatingsWrap from './RatingsWrap/RatingsWrap';
import WeightTag from '../components/WeightTag';
import DEFAULTS from '../object/const/defaultValues';
import { getAuthenticatedUserName, getScreenSize } from '../reducers';
import { getObjectName, parseAddress } from '../helpers/wObjectHelper';
import { getProxyImageURL } from '../helpers/image';

import './ObjectCardView.less';

const ObjectCardView = ({
  intl,
  wObject,
  options: { mobileView = 'compact', ownRatesOnly = false },
  passedParent,
}) => {
  const screenSize = useSelector(getScreenSize);
  const username = useSelector(getAuthenticatedUserName);
  const [tags, setTags] = useState([]);
  const parent = isEmpty(passedParent) ? get(wObject, 'parent', {}) : passedParent;
  const address = parseAddress(wObject);

  useEffect(() => {
    if (wObject.tagCategories && wObject.tagCategories.length) {
      const currentTags = wObject.tagCategories
        .map(category => category.categoryItems)
        .filter(categoryItems => !!categoryItems.length)
        .map(items => orderBy(items, ['weight', 'name'])[0].name);
      setTags(currentTags);
    } else setTags([wObject.object_type]);
  }, []);

  const pathName = wObject.defaultShowLink;

  const avatarLayout = () => {
    let url = wObject.avatar || parent.avatar;

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
                  to={get(parent, 'defaultShowLink')}
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
  wObject: PropTypes.shape().isRequired,
  passedParent: PropTypes.shape(),
  options: PropTypes.shape({
    mobileView: PropTypes.oneOf(['compact', 'full']),
    ownRatesOnly: PropTypes.bool,
    pathNameAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  }),
};

ObjectCardView.defaultProps = {
  options: {},
  passedParent: {},
};
export default injectIntl(ObjectCardView);
