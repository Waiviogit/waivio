import React, { useEffect, useState } from 'react';
import { Col, Rate, Row } from 'antd';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { averageRate, calculateRateCurrUser } from '../../components/Sidebar/Rate/rateHelper';
import steemConnectAPI from '../../steemConnectAPI';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';

import './RatingsWrap.less';

const RatingsWrap = React.memo(({ ratings, wobjId, username, overlay }) => {
  const [sortedRatings, setSortingRatings] = useState([]);
  const mappedRatings = ratings.map(d => ({ ...d, rating: averageRate(d) }));
  const isAuth = useSelector(getIsAuthenticated);

  useEffect(() => {
    const ratingList = overlay
      ? [mappedRatings.sort((a, b) => b.rating - a.rating)[0]]
      : sortBy(mappedRatings, ['body']);

    setSortingRatings(ratingList);
  }, []);

  const ratingTitleClassList = classNames('RatingsWrap__rate-title');

  const handleSubmit = (rate, field) =>
    steemConnectAPI.rankingObject(username, field.author, field.permlink, wobjId, rate * 2);

  const rateLayout = (colNum, rateIndex) => {
    const currRate = sortedRatings[rateIndex];
    const ratingVotesList = currRate.rating_votes || [];
    const haveCurrentUserVote = ratingVotesList.some(vote => vote.voter === username);
    const defaultValue = haveCurrentUserVote
      ? calculateRateCurrUser(currRate.rating_votes, username)
      : averageRate(currRate);

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
    });

    return (
      <Col className={ratingWrapClassList} span={colNum}>
        <div className="RatingsWrap__stars" role="presentation">
          <Rate
            allowHalf
            defaultValue={defaultValue}
            onChange={onChange}
            className={ratingClassList}
            disabled={!isAuth}
          />
        </div>
        <div className={ratingTitleClassList}>{currRate.body}</div>
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
});

RatingsWrap.propTypes = {
  overlay: PropTypes.bool,
  ratings: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  wobjId: PropTypes.string.isRequired,
  username: PropTypes.string,
};

RatingsWrap.defaultProps = {
  overlay: false,
  username: '',
};

export default RatingsWrap;
