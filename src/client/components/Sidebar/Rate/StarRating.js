import _ from 'lodash';
import React from 'react';
import { Progress } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { averageRate, rateCount } from './rateHelper';
import { ratePercent } from '../../../../common/constants/listOfFields';
import './StarRating.less';

@injectIntl
class StarRating extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    field: PropTypes.shape().isRequired,
  };

  renderVotes = field => {
    const display = [];
    const ratingVotes = field.rating_votes;

    if (!ratingVotes) {
      return this.props.intl.formatMessage({
        id: 'no_votes_message',
        defaultMessage: 'There is no votes',
      });
    }

    const count = rateCount(field);

    _.forEachRight(ratePercent, (percent, index) => {
      const fieldsWithPercent = ratingVotes.filter(f => f.rate === percent);

      let votePercent = 0;

      if (fieldsWithPercent[0]) {
        votePercent = (fieldsWithPercent.length / count) * 100;
      }

      display.push(
        <div key={index} className="StarRating__progress_wrap">
          <div className="StarRating__progress_line">
            {this.props.intl.formatMessage(
              {
                id: 'rate_star_count',
                defaultMessage: '{count} star',
              },
              {
                count: index + 1,
              },
            )}
          </div>
          <Progress status="normal" percent={votePercent} />
        </div>,
      );
    });

    return display;
  };

  render() {
    const { field } = this.props;
    const rating = averageRate(field);
    const votes = rateCount(field);

    return (
      <React.Fragment>
        <div className="StarRating__info">
          <div>
            {this.props.intl
              .formatMessage({
                id: 'rate_overall',
                defaultMessage: 'Overall',
              })
              .toUpperCase()}
          </div>
          <div>
            {this.props.intl.formatMessage(
              {
                id: 'rate_average_count',
                defaultMessage: 'Rating: {count}',
              },
              {
                count: rating.toFixed(2),
              },
            )}
          </div>
          <div>
            {this.props.intl.formatMessage(
              {
                id: 'vote_count',
                defaultMessage: 'Votes: {votes}',
              },
              {
                votes,
              },
            )}
          </div>
        </div>
        <div>{this.renderVotes(field)}</div>
      </React.Fragment>
    );
  }
}

StarRating.propTypes = {};

export default StarRating;
