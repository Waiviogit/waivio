import { Icon, Popover } from 'antd';
import React from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RatingsWrap from './RatingsWrap/RatingsWrap';
import WeightTag from '../components/WeightTag';
import { getFieldWithMaxWeight } from '../object/wObjectHelper';
import DEFAULTS from '../object/const/defaultValues';
import { objectFields as objectTypes } from '../../common/constants/listOfFields';
import './ObjectCardView.less';

const ObjectCardView = ({
  wObject,
  showSmallVersion,
  pathNameAvatar,
  intl,
                          screenSize,
  isCloseButton,
  deleteLinkedObject,
}) => {
  const getObjectRatings = () => _.filter(wObject.fields, ['name', 'rating']);
  const pathName = pathNameAvatar || `/object/${wObject.id}`;
  const ratings = getObjectRatings();

  const isMobile = screenSize === 'xsmall' || screenSize === 'small';

  const avatarLayout = (avatar = DEFAULTS.AVATAR) => {
    let url = avatar;
    if (_.includes(url, 'waivio.')) url = `${url}_medium`;

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

  const titleTruncate = () => {
    const maxLength = 55;
    if (isMobile) {
      if (wObject.title.length > maxLength) {
        const titleElement = `${wObject.title.slice(0, maxLength - 1)}...`;
        return (
          <Popover content={wObject.title} trigger="click">
            {titleElement}
          </Popover>
        );
      }
      return wObject.title;
    }
    return wObject.title;
  };

  const objName = wObject.name || wObject.default_name;
  const parentName = wObject.parent ? getFieldWithMaxWeight(wObject.parent, objectTypes.name) : '';
  const goToObjTitle = wobjName =>
    `${intl.formatMessage({
      id: 'GoTo',
      defaultMessage: 'Go to',
    })} ${wobjName}`;

  const deleteLinkedObjectHandler = () => deleteLinkedObject(objName);

  return (
    <React.Fragment>
      <div className="ObjectCardView">
        <div className="ObjectCardView__content">
          <div className="ObjectCardView__content-row">
            <Link to={pathName} title={goToObjTitle(objName)} className="ObjectCardView__avatar">
              {avatarLayout(wObject.avatar)}
            </Link>
            <div className={`ObjectCardView__info${showSmallVersion ? ' small' : ''}`}>
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
                {wObject.weight !== 0 ? <WeightTag weight={wObject.weight} /> : null}
              </div>
              {ratings && <RatingsWrap ratings={ratings} />}
              {wObject.title && (
                <div className="ObjectCardView__title" title={wObject.title}>
                  {titleTruncate()}
                </div>
              )}
              {isCloseButton && (
                <img
                  className="ObjectCardView__close"
                  title={wObject.title}
                  alt="close"
                  onClick={deleteLinkedObjectHandler}
                  src="./images/icons/hide-object.svg"
                />
              )}
              {wObject.price && (
                <span className="ObjectCardView__price" title={wObject.price}>
                  <Icon type="dollar" />
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
  wObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  showSmallVersion: PropTypes.bool,
  pathNameAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
};

ObjectCardView.defaultProps = {
  showSmallVersion: false,
  pathNameAvatar: '',
};
export default injectIntl(ObjectCardView);
