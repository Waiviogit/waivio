import { Icon } from 'antd';
import React from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RatingsWrap from '../../../../../client/objectCard/RatingsWrap/RatingsWrap';
import WeightTag from '../../../../../client/components/WeightTag';
import { getFieldWithMaxWeight } from '../../../../../client/object/wObjectHelper';
import DEFAULTS from '../../../../../client/object/const/defaultValues';
import { objectFields as objectTypes } from '../../../../../common/constants/listOfFields';
import TradeButtons from '../../TradeButtons/TradeButtons';
import './instrumentCardView.less';

const InstrumentCardView = ({ wObject, showSmallVersion, pathNameAvatar, intl }) => {
  const getObjectRatings = () => _.filter(wObject.fields, ['name', 'rating']);
  const pathName = pathNameAvatar || `/object/${wObject.id}`;
  const ratings = getObjectRatings();

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
  const parentName = wObject.parent ? getFieldWithMaxWeight(wObject.parent, objectTypes.name) : '';
  const goToObjTitle = wobjName =>
    `${intl.formatMessage({
      id: 'GoTo',
      defaultMessage: 'Go to',
    })} ${wobjName}`;
  return (
    <React.Fragment>
      <div className="InstrumentCardView">
        <div className="InstrumentCardView__content">
          <div className="InstrumentCardView__content-row">
            <Link
              to={pathName}
              title={goToObjTitle(wObject.name)}
              className="InstrumentCardView__avatar"
              target="_blank"
            >
              {avatarLayout(wObject.avatar)}
            </Link>
            <div className={`InstrumentCardView__info${showSmallVersion ? ' small' : ''}`}>
              {parentName && (
                <Link
                  to={`/object/${wObject.parent.author_permlink}`}
                  title={goToObjTitle(parentName)}
                  className="InstrumentCardView__type"
                >
                  {parentName}
                </Link>
              )}
              <div className="InstrumentCardView__name">
                <Link
                  to={pathName}
                  className="InstrumentCardView__name-truncated"
                  title={goToObjTitle(wObject.name)}
                >
                  {wObject.name}
                </Link>
                {wObject.weight && <WeightTag weight={wObject.weight} />}
              </div>
              {ratings && <RatingsWrap ratings={ratings} />}
              {wObject.title && (
                <div className="InstrumentCardView__title" title={wObject.title}>
                  {wObject.title}
                </div>
              )}
              {wObject.price && (
                <span className="InstrumentCardView__price" title={wObject.price}>
                  <Icon type="dollar" />
                  {wObject.price}
                </span>
              )}
            </div>
            <TradeButtons
              className="st-assets-buttons st-trade-buttons-asset-page-wrap"
              quoteSecurity={wObject.chartid}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

InstrumentCardView.propTypes = {
  wObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  showSmallVersion: PropTypes.bool,
  pathNameAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
};

InstrumentCardView.defaultProps = {
  showSmallVersion: false,
  pathNameAvatar: '',
};

export default injectIntl(InstrumentCardView);
