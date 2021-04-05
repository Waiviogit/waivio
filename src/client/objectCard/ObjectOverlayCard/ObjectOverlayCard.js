import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { includes, get, isEmpty, has } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import RatingsWrap from './../RatingsWrap/RatingsWrap';
import DEFAULTS from '../../object/const/defaultValues';
import { getAuthenticatedUserName } from '../../store/reducers';
import { getObjectName, getObjectAvatar, hasType } from '../../helpers/wObjectHelper';
import { getProxyImageURL } from '../../helpers/image';

import './ObjectOverlayCard.less';
import OverlayRewardsButton from './OverlayRewardsButton';
import { getScreenSize } from '../../store/appStore/appSelectors';

const ObjectOverlayCard = ({
  intl,
  wObject,
  options: { mobileView = 'compact', ownRatesOnly = false },
  path,
  passedParent,
  showParent,
}) => {
  const screenSize = useSelector(getScreenSize);
  const username = useSelector(getAuthenticatedUserName);
  const [tags, setTags] = useState([]);
  const parent = isEmpty(passedParent) ? get(wObject, 'parent', {}) : passedParent;
  const objName = getObjectName(wObject);
  const parentLink = get(parent, 'defaultShowLink');
  const parentName = getObjectName(parent);
  const isProposition = has(wObject, 'propositions');
  let pathName = wObject.defaultShowLink || `/object/${wObject.author_permlink}`;

  pathName = hasType(wObject, 'page') ? path : pathName;

  useEffect(() => {
    const objectTags = get(wObject, 'topTags', []);

    setTags(objectTags);
  }, [wObject.author_permlink]);

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
        data-anchor={wObject.author_permlink}
      />
    );
  };

  const goToObjTitle = wobjName =>
    `${intl.formatMessage({
      id: 'GoTo',
      defaultMessage: 'Go to',
    })} ${wobjName}`;

  return (
    <div
      className="ObjectOverlayCard"
      key={wObject.author_permlink}
      data-anchor={wObject.author_permlink}
    >
      {(wObject.campaigns || wObject.propositions) && (
        <OverlayRewardsButton wObject={wObject} isPropos={isProposition} intl={intl} />
      )}
      <div className="ObjectOverlayCard__content-row">
        <Link
          to={pathName}
          title={goToObjTitle(objName)}
          className="ObjectOverlayCard__avatar"
          key={wObject.author_permlink}
        >
          {avatarLayout()}
        </Link>
        <div className="ObjectOverlayCard__info">
          {parentName && showParent && (
            <Link
              to={parentLink}
              data-anchor={wObject.author_permlink}
              title={goToObjTitle(parentName)}
              className="ObjectCardView__type"
            >
              {parentName}
            </Link>
          )}
          <div className="ObjectOverlayCard__name">
            <Link
              key={wObject.author_permlink}
              to={pathName}
              className="ObjectOverlayCard__name-truncated"
              title={goToObjTitle(objName)}
              data-anchor={wObject.author_permlink}
            >
              {objName}
            </Link>
          </div>
          {wObject.rating && (
            <RatingsWrap
              mobileView={mobileView}
              ownRatesOnly={ownRatesOnly}
              ratings={wObject.rating}
              screenSize={screenSize}
              username={username}
              wobjId={wObject.author_permlink}
              wobjName={objName}
              overlay
            />
          )}
          <span className="ObjectOverlayCard__tag-text">
            {wObject.price && (
              <span className="ObjectOverlayCard__price" title={wObject.price}>
                {wObject.price}
              </span>
            )}
            {isEmpty(tags) ? (
              <span>
                {wObject.price && <span>&nbsp;&middot;&nbsp;</span>}
                {wObject.object_type}
              </span>
            ) : (
              tags.map((tag, index) => (
                <span key={tag}>
                  {!index && !wObject.price ? tag : <span>&nbsp;&middot;{` ${tag}`}</span>}
                </span>
              ))
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

ObjectOverlayCard.propTypes = {
  intl: PropTypes.shape().isRequired,
  wObject: PropTypes.shape(),
  passedParent: PropTypes.shape(),
  path: PropTypes.string,
  showParent: PropTypes.bool,
  options: PropTypes.shape({
    mobileView: PropTypes.oneOf(['compact', 'full']),
    ownRatesOnly: PropTypes.bool,
    pathNameAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  }),
};

ObjectOverlayCard.defaultProps = {
  options: {},
  wObject: {},
  path: '',
  passedParent: {},
  showParent: false,
};
export default injectIntl(ObjectOverlayCard);
