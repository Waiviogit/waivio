import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Tag, Row } from 'antd';
import './/ObjectCardView.less';
import { getScreenSize } from '../reducers';
import RatingsWrap from './RatingsWrap/RatingsWrap';

const ObjectCardView = ({ wObject, screenSize }) => {
  const getObjectRatings = () => _.filter(wObject.fields, ['name', 'rating']);
  const pathName = `/object/${wObject.id}`;
  const ratings = getObjectRatings();
  return (
    <React.Fragment>
      <div className="ObjectCardView">
        <div className="ObjectCardView__content">
          <Row className="ObjectCardView__content row">
            <a href={pathName} target="_blank" rel="noopener noreferrer">
              <div
                className="ObjectCardView__avatar"
                style={{
                  backgroundImage: `url(${wObject.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </a>
            <div className="ObjectCardView__info">
              <div className="ObjectCardView__type">{wObject.type}</div>
              <a
                href={pathName}
                target="_blank"
                rel="noopener noreferrer"
                className="ObjectCardView__name"
              >
                <div className="ObjectCardView__name-truncated" title={wObject.name}>
                  {wObject.name}
                </div>
                {wObject.rank && <Tag>{wObject.rank}</Tag>}
              </a>
              {ratings && <RatingsWrap ratings={ratings} isMobile={screenSize === 'xsmall'} />}
              {wObject.title && (
                <div className="ObjectCardView__title" title={wObject.title}>
                  {wObject.title}
                </div>
              )}
            </div>
          </Row>
        </div>
        <div className="ObjectCardView__controls">
          {/* <div */}
          {/* role="button" */}
          {/* tabIndex={0} */}
          {/* className="ObjectCardView__control-item delete" */}
          {/* onClick={() => handleRemoveObject(wObject)} */}
          {/* > */}
          {/* <Icon */}
          {/* type="close" */}
          {/* className="ObjectCardView__control-item item-icon" */}
          {/* title={intl.formatMessage({ id: 'remove', defaultMessage: 'Remove' })} */}
          {/* /> */}
          {/* </div> */}
        </div>
      </div>
    </React.Fragment>
  );
};

ObjectCardView.propTypes = {
  wObject: PropTypes.shape().isRequired,
  screenSize: PropTypes.bool.isRequired,
};

export default injectIntl(
  connect(state => ({
    screenSize: getScreenSize(state),
  }))(ObjectCardView),
);
