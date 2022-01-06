import React from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';

import { averageRate, calculateRateCurrUser, rateCount } from './rateHelper';
import { getRatingFields } from '../../../../store/wObjectStore/wObjectSelectors';
import { rateObject } from '../../../../store/wObjectStore/wobjActions';

import './RateInfo.less';

@injectIntl
@connect(
  state => ({
    ratingFields: getRatingFields(state),
  }),
  { rateObject },
)
class RateInfo extends React.PureComponent {
  static propTypes = {
    username: PropTypes.string.isRequired,
    ratingFields: PropTypes.arrayOf(PropTypes.shape()),
    authorPermlink: PropTypes.string.isRequired,
    rateObject: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ratingFields: [],
  };

  handleSubmit = (rate, field) => {
    this.props.rateObject(field.author, field.permlink, this.props.authorPermlink, rate * 2);
  };

  render() {
    const { ratingFields, username } = this.props;

    return (
      <React.Fragment>
        {ratingFields &&
          ratingFields.map(field => {
            const haveCurrentUserVote = get(field, 'rating_votes', []).some(
              vote => vote.voter === username,
            );
            const ratingClassList = classNames({
              myvote: haveCurrentUserVote,
            });

            return (
              <div className="RateInfo__header" key={field.permlink}>
                <div>{field.body}</div>
                <div className="RateInfo__stars">
                  <div className="RateInfo__stars-container" role="presentation">
                    <Rate
                      allowHalf
                      defaultValue={
                        haveCurrentUserVote
                          ? calculateRateCurrUser(field.rating_votes, username)
                          : averageRate(field)
                      }
                      className={ratingClassList}
                      onChange={e => this.handleSubmit(e, field)}
                    />
                  </div>
                  <div>({rateCount(field)})</div>
                </div>
              </div>
            );
          })}
      </React.Fragment>
    );
  }
}

export default RateInfo;
