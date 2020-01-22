import React from 'react';
import { useSelector } from 'react-redux';
import { filter, includes } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RatingsWrap from './RatingsWrap/RatingsWrap';
import WeightTag from '../components/WeightTag';
import { getFieldWithMaxWeight } from '../object/wObjectHelper';
import DEFAULTS from '../object/const/defaultValues';
import { objectFields as objectTypes } from '../../common/constants/listOfFields';
import { getAuthenticatedUserName, getScreenSize } from '../reducers';
import './ObjectCardView.less';

const ObjectCardView = ({
  intl,
  wObject,
  options: { mobileView = 'compact', ownRatesOnly = false, pathNameAvatar = '' },
}) => {
  const screenSize = useSelector(getScreenSize);
  const username = useSelector(getAuthenticatedUserName);

  const getObjectRatings = () => {
    const ratingFields = filter(wObject.fields, ['name', 'rating']);
    return ownRatesOnly
      ? ratingFields.map(rating => ({
          ...rating,
          rating_votes: rating.rating_votes.filter(vote => vote.voter === username),
        }))
      : ratingFields;
  };
  const pathName = pathNameAvatar || `/object/${wObject.id}`;
  const ratings = getObjectRatings();

  const avatarLayout = (avatar = DEFAULTS.AVATAR) => {
    let url = avatar;
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
  const parentName = wObject.parent ? getFieldWithMaxWeight(wObject.parent, objectTypes.name) : '';
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
              {avatarLayout(wObject.avatar)}
            </Link>
            <div className={'ObjectCardView__info'}>
              {parentName && (
                <Link
                  to={`/object/${wObject.parent.author_permlink}`}
                  title={goToObjTitle(parentName)}
                  className="ObjectCardView__type"
                >
                  {parentName}
                </Link>
              )}
              <div className="ObjectCardView__name">
                <Link
                  to={pathName}
                  className="ObjectCardView__name-truncated"
                  title={goToObjTitle(objName)}
                >
                  {objName}
                </Link>
                {wObject.weight && <WeightTag weight={wObject.weight} />}
              </div>
              {ratings && (
                <RatingsWrap
                  mobileView={mobileView}
                  ownRatesOnly={ownRatesOnly}
                  ratings={ratings}
                  screenSize={screenSize}
                  username={username}
                  wobjId={wObject.id || wObject.author_permlink}
                  wobjName={wObject.name || wObject.default_name}
                />
              )}
              {wObject.title && (
                <div className="ObjectCardView__title" title={wObject.title}>
                  {wObject.title}
                </div>
              )}
              {wObject.price && (
                <span className="ObjectCardView__price" title={wObject.price}>
                  {wObject.price}
                </span>
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
