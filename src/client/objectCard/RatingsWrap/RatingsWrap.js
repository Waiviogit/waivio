import React, { useState } from 'react';
import { Col, Rate, Row } from 'antd';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  averageRate,
  calculateRateCurrUser,
  formatAverageRate,
} from '../../components/Sidebar/Rate/rateHelper';
import steemConnectAPI from '../../steemConnectAPI';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';

import './RatingsWrap.less';

const prepereRatings = (ratings, overlay) => {
  const mappedRatings = ratings.map(d => ({ ...d, rating: averageRate(d) }));

  return overlay
    ? [mappedRatings.sort((a, b) => b.rating - a.rating)[0]]
    : sortBy(mappedRatings, ['body']);
};

const RatingsWrap = React.memo(
  ({ ratings, wobjId, socialMap, username, overlay, isSocialProduct }) => {
    const rating = socialMap ? ratings?.slice(0, 1) : ratings;
    const [sortedRatings, setSortingRatings] = useState(prepereRatings(rating, overlay));

    const isAuth = useSelector(getIsAuthenticated);
    const ratingTitleClassList = classNames('RatingsWrap__rate-title', {
      'RatingsWrap__rate-title-black': isSocialProduct,
    });

    const handleSubmit = (rate, field) =>
      steemConnectAPI.rankingObject(username, field.author, field.permlink, wobjId, rate * 2);

    const rateLayout = (colNum, rateIndex) => {
      const currRate = sortedRatings[rateIndex];
      const ratingVotesList = currRate.rating_votes || [];
      const haveCurrentUserVote = ratingVotesList.some(vote => vote.voter === username);
      const defaultValue = haveCurrentUserVote
        ? calculateRateCurrUser(currRate.rating_votes, username)
        : formatAverageRate(currRate.average_rating_weight);

      const onChange = e => {
        handleSubmit(e, currRate);
        if (!haveCurrentUserVote) {
          sortedRatings.splice(rateIndex, 1, {
            ...currRate,
            rating_votes: [...ratingVotesList, { rate: e, voter: username }],
          });

          setSortingRatings([...sortedRatings]);
        }
      };

      const ratingClassList = classNames({
        myvote: haveCurrentUserVote,
      });
      const ratingWrapClassList = classNames('RatingsWrap__rate', {
        RatingsWrap__overlay: overlay,
        RatingsWrap__socialRate: isSocialProduct,
      });

      return (
        <Col className={ratingWrapClassList} span={colNum}>
          <div
            className={isSocialProduct ? 'RatingsWrap__socialStars' : 'RatingsWrap__stars'}
            role="presentation"
            title={defaultValue}
            onClick={e => e.stopPropagation()}
          >
            <Rate
              allowHalf
              defaultValue={defaultValue}
              onChange={onChange}
              className={ratingClassList}
              disabled={!isAuth}
            />
          </div>
          <span className={ratingTitleClassList}>{currRate.body}</span>
        </Col>
      );
    };

    return sortedRatings[0] ? (
      <div className="RatingsWrap">
        <Row>
          {rateLayout(sortedRatings[1] ? 12 : 24, 0)}
          {sortedRatings[1] && rateLayout(12, 1)}
        </Row>
        {sortedRatings[2] && (
          <Row>
            {rateLayout(sortedRatings[3] ? 12 : 24, 2)}
            {sortedRatings[3] && rateLayout(12, 3)}
          </Row>
        )}
      </div>
    ) : null;
  },
);

RatingsWrap.propTypes = {
  overlay: PropTypes.bool,
  socialMap: PropTypes.bool,
  isSocialProduct: PropTypes.bool,
  ratings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  wobjId: PropTypes.string.isRequired,
  username: PropTypes.string,
};

RatingsWrap.defaultProps = {
  overlay: false,
  isSocialProduct: false,
  socialMap: false,
  username: '',
};

export default RatingsWrap;
