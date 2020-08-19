import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filter, includes, orderBy, truncate, get } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import RatingsWrap from './RatingsWrap/RatingsWrap';
import WeightTag from '../components/WeightTag';
import DEFAULTS from '../object/const/defaultValues';
import { getAuthenticatedUserName, getScreenSize } from '../reducers';

import './ObjectCardView.less';

const ObjectCardView = ({
  intl,
  wObject,
  options: { mobileView = 'compact', ownRatesOnly = false, pathNameAvatar = '' },
}) => {
  const screenSize = useSelector(getScreenSize);
  const username = useSelector(getAuthenticatedUserName);
  const [tags, setTags] = useState([]);
  const parent = get(wObject, 'parent', {});

  useEffect(() => {
    if (wObject.tagCategories && wObject.tagCategories.length) {
      const currentTags = wObject.tagCategories
        .map(category => category.categoryItems)
        .filter(categoryItems => !!categoryItems.length)
        .map(items => orderBy(items, ['weight', 'name'])[0].name);
      setTags(currentTags);
    } else setTags([wObject.object_type]);
  }, []);
  const getObjectRatings = () => {
    const ratingFields = filter(wObject.fields, ['name', 'rating']);
    return ownRatesOnly
      ? ratingFields.map(rating => ({
          ...rating,
          rating_votes:
            (rating.rating_votes && rating.rating_votes.filter(vote => vote.voter === username)) ||
            [],
        }))
      : ratingFields;
  };
  const pathName = pathNameAvatar || `/object/${wObject.id}`;
  const ratings = getObjectRatings();

  const avatarLayout = () => {
    let url = wObject.avatar || parent.avatar;

    if (!url) url = DEFAULTS.AVATAR;

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
  const objName = wObject.name || wObject.default_name;
  const parentName = parent.name || parent.default_name;
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
    <React.Fragment>
      <div className="ObjectCardView">
        <div className="ObjectCardView__content">
          <div className="ObjectCardView__content-row">
            <Link to={pathName} title={goToObjTitle(objName)} className="ObjectCardView__avatar">
              {avatarLayout()}
            </Link>
            <div className="ObjectCardView__info">
              {parentName && (
                <Link
                  to={`/object/${get(parent, 'author_permlink', '')}`}
                  title={goToObjTitle(parentName)}
                  className="ObjectCardView__type"
                >
                  {parentName}
                </Link>
              )}
              <div className="ObjectCardView__name">
                <Link
                  to={`/object/${wObject.author_permlink}`}
                  className="ObjectCardView__name-truncated"
                  title={goToObjTitle(objName)}
                >
                  {objName}
                </Link>
                {!isNaN(wObject.weight) && <WeightTag weight={Number(wObject.weight)} />}
              </div>
              {ratings && (
                <RatingsWrap
                  mobileView={mobileView}
                  ownRatesOnly={ownRatesOnly}
                  ratings={ratings}
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
              {wObject.address && (
                <div className="ObjectCardView__tag-text">
                  {(wObject.address.street || wObject.address.address) && (
                    <span>
                      {`${
                        wObject.address.street ? wObject.address.street : wObject.address.address
                      }, `}
                    </span>
                  )}
                  {wObject.address.city && <span>{wObject.address.city}</span>}
                </div>
              )}
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
    </React.Fragment>
  );
};

ObjectCardView.propTypes = {
  intl: PropTypes.shape().isRequired,
  wObject: PropTypes.shape().isRequired,
  options: PropTypes.shape({
    mobileView: PropTypes.oneOf(['compact', 'full']),
    ownRatesOnly: PropTypes.bool,
    pathNameAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  }),
};

ObjectCardView.defaultProps = {
  options: {},
};
export default injectIntl(ObjectCardView);
