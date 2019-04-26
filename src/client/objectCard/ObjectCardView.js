import React from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Row } from 'antd';
import { Link } from 'react-router-dom';
import './ObjectCardView.less';
import RatingsWrap from './RatingsWrap/RatingsWrap';
import WeightTag from '../components/WeightTag';
import { getFieldWithMaxWeight } from '../object/wObjectHelper';
import { objectFields as objectTypes } from '../../common/constants/listOfFields';

const ObjectCardView = ({ wObject, showSmallVersion, pathNameAvatar, intl }) => {
  const getObjectRatings = () => _.filter(wObject.fields, ['name', 'rating']);
  const pathName = pathNameAvatar || `/object/${wObject.id}`;
  const ratings = getObjectRatings();
  const avatarLayout = avatar => (
    <div
      className="ObjectCardView__avatar"
      style={{
        backgroundImage: `url(${avatar})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
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
          <Row className="ObjectCardView__content row">
            <Link to={pathName} title={goToObjTitle(wObject.name)}>
              {avatarLayout(wObject.avatar)}
            </Link>
            <div className="ObjectCardView__info">
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
                  title={goToObjTitle(wObject.name)}
                >
                  {wObject.name}
                </Link>
                {wObject.weight && <WeightTag weight={wObject.weight} rank={wObject.rank} />}
              </div>
              {ratings && <RatingsWrap ratings={ratings} showSmallVersion={showSmallVersion} />}
              {wObject.title && (
                <div className="ObjectCardView__title" title={wObject.title}>
                  {wObject.title}
                </div>
              )}
            </div>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

ObjectCardView.propTypes = {
  wObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  showSmallVersion: PropTypes.bool,
  pathNameAvatar: PropTypes.string,
};

ObjectCardView.defaultProps = {
  showSmallVersion: false,
  pathNameAvatar: '',
};
export default injectIntl(ObjectCardView);
