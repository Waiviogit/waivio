import React from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';

import { calculateRateCurrUser, formatAverageRate, rateCount } from './rateHelper';
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
  constructor(props) {
    super(props);

    this.state = {
      localFields: props.ratingFields,
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.ratingFields !== this.props.ratingFields) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ localFields: this.props.ratingFields });
    }
  }

  handleSubmit = (rate, field) => {
    const { username, authorPermlink } = this.props;

    this.props.rateObject(field.author, field.permlink, authorPermlink, rate * 2);

    // Optimistically update local state
    this.setState(prevState => {
      const updatedFields = prevState.localFields.map(f => {
        if (f.permlink === field.permlink) {
          const filteredVotes = (f.rating_votes || []).filter(v => v.voter !== username);

          return {
            ...f,
            rating_votes: [...filteredVotes, { voter: username, rate: rate * 2 }],
          };
        }

        return f;
      });

      return { localFields: updatedFields };
    });
  };
  render() {
    const { username } = this.props;
    const { localFields } = this.state;

    return (
      <React.Fragment>
        {localFields.map(field => {
          const ratingVotes = field.rating_votes || [];
          const haveCurrentUserVote = ratingVotes.some(v => v.voter === username);

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
                        ? calculateRateCurrUser(ratingVotes, username)
                        : formatAverageRate(field.average_rating_weight)
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
