import React, { useState } from 'react';
import { Col, Rate, Row } from 'antd';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { averageRate, avrRate } from '../../components/Sidebar/Rate/rateHelper';
import RateObjectModal from '../../components/Sidebar/Rate/RateObjectModal';
import './RatingsWrap.less';

const RatingsWrap = ({
  ownRatesOnly,
  ratings,
  screenSize,
  wobjId,
  wobjName,
  username,
  mobileView,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const isMobile = screenSize === 'xsmall' || screenSize === 'small';
  const sortedRatings = sortBy(ratings, ['body']);

  const openRateModal = selectedRate => () => {
    setSelectedRating(selectedRate);
    setIsModalVisible(true);
  };

  const closeRateModal = () => {
    setSelectedRating(null);
    setIsModalVisible(false);
  };

  const rateLayout = (colNum, rateIndex, dividerClass) => (
    <Col className={`RatingsWrap__rate ${dividerClass}`} span={colNum}>
      <div
        className="RatingsWrap__stars"
        role="presentation"
        onClick={openRateModal(sortedRatings[rateIndex])}
      >
        <Rate allowHalf disabled value={averageRate(sortedRatings[rateIndex])} />
      </div>
      <div className="RatingsWrap__rate-title">{sortedRatings[rateIndex].body}</div>
    </Col>
  );

  const mobileRatesLayout = isCompactView => {
    if (isCompactView) {
      return (
        <div className="RatingsWrap">
          <div className="RatingsWrap-rate">
            <Rate allowHalf disabled value={avrRate(sortedRatings)} />
          </div>
        </div>
      );
    }
    return (
      <div className="RatingsWrap">
        {sortedRatings.map(rate => (
          <div className="RatingsWrap__rate" key={rate.body}>
            <div className="RatingsWrap__stars" role="presentation" onClick={openRateModal(rate)}>
              <Rate allowHalf disabled value={averageRate(rate)} />
            </div>
            <div className="RatingsWrap__rate-title">{rate.body}</div>
          </div>
        ))}
      </div>
    );
  };

  return sortedRatings[0] ? (
    <React.Fragment>
      {isMobile ? (
        mobileRatesLayout(mobileView === 'compact')
      ) : (
        <div className="RatingsWrap">
          <Row>
            {rateLayout(
              sortedRatings[1] ? 12 : 24,
              0,
              sortedRatings[1] ? 'RatingsWrap__divider' : '',
            )}
            {sortedRatings[1] && rateLayout(12, 1, 'RatingsWrap__rate-right-col')}
          </Row>
          {sortedRatings[2] && (
            <Row>
              {rateLayout(sortedRatings[3] ? 12 : 24, 2, 'RatingsWrap__divider')}
              {sortedRatings[3] && rateLayout(12, 3, 'RatingsWrap__rate-right-col')}
            </Row>
          )}
        </div>
      )}
      <RateObjectModal
        isVisible={isModalVisible}
        ownRatesOnly={ownRatesOnly}
        ratingCategoryField={selectedRating}
        ratingFields={sortedRatings}
        username={username}
        wobjId={wobjId}
        wobjName={wobjName}
        onCancel={closeRateModal}
      />
    </React.Fragment>
  ) : null;
};

RatingsWrap.propTypes = {
  ownRatesOnly: PropTypes.bool,
  ratings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  screenSize: PropTypes.string.isRequired,
  wobjId: PropTypes.string.isRequired,
  wobjName: PropTypes.string.isRequired,
  username: PropTypes.string,
  mobileView: PropTypes.oneOf(['compact', 'full']),
};

RatingsWrap.defaultProps = {
  ownRatesOnly: false,
  username: '',
  mobileView: 'compact',
  wobjName: '',
};

export default RatingsWrap;
