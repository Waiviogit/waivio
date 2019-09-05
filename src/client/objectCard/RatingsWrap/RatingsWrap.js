import React from 'react';
import { Col, Rate, Row } from 'antd';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { averageRate, avrRate } from '../../components/Sidebar/Rate/rateHelper';
import './RatingsWrap.less';
import { getScreenSize } from '../../reducers';

const RatingsWrap = ({ ratings, screenSize }) => {
  const isMobile = screenSize === 'xsmall' || screenSize === 'small';
  // _.orderBy(sortedRatings, [sortedRatings., 'age'], ['asc', 'desc']);
  const sortedRatings = sortBy(ratings, ['body']);
  let layout = null;

  const rateLayout = (colNum, rateIndex, dividerClass) => (
    <Col className={`RatingsWrap__rate ${dividerClass}`} span={colNum}>
      <Rate
        allowHalf
        disabled
        value={averageRate(sortedRatings[rateIndex])}
        className="RatingsWrap__stars"
      />
      <div className="RatingsWrap__rate-title">{sortedRatings[rateIndex].body}</div>
    </Col>
  );
  if (sortedRatings[0]) {
    if (!isMobile) {
      layout = (
        <div className="RatingsWrap">
          <Row>
            {rateLayout(sortedRatings[1] ? 12 : 24, 0, '')}
            {sortedRatings[1] && rateLayout(12, 1, 'RatingsWrap__divider')}
          </Row>
          {sortedRatings[2] && (
            <Row>
              {rateLayout(sortedRatings[3] ? 12 : 24, 2, '')}
              {sortedRatings[3] && rateLayout(12, 3, 'RatingsWrap__divider')}
            </Row>
          )}
        </div>
      );
    } else {
      layout = (
        <div className="RatingsWrap">
          <div className="RatingsWrap-rate">
            <Rate allowHalf disabled value={avrRate(sortedRatings)} />
            {/* <div className="RatingsWrap__rate-title"> */}
            {/* {`(${sortedRatings.length})`} */}
            {/* </div> */}
          </div>
        </div>
      );
    }
  }
  return layout;
};

RatingsWrap.propTypes = {
  ratings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  screenSize: PropTypes.string.isRequired,
  showSmallVersion: PropTypes.bool,
};

RatingsWrap.defaultProps = {
  showSmallVersion: false,
};

export default connect(state => ({
  screenSize: getScreenSize(state),
}))(RatingsWrap);
