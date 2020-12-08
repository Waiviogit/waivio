import { isEqual, sortBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { averageRate, rateCount } from './rateHelper';
import { ratePercent } from '../../../../common/constants/listOfFields';
import { getRatingFields } from '../../../reducers';
import BTooltip from '../../BTooltip';
import RateObjectModal from './RateObjectModal';

import './RateInfo.less';

@injectIntl
@connect(state => ({
  ratingFields: getRatingFields(state),
}))
class RateInfo extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    ratingFields: PropTypes.arrayOf(PropTypes.shape()),
    authorPermlink: PropTypes.string.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    ratingFields: [],
  };

  state = {
    showModal: false,
    field: {},
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props.ratingFields, nextProps.ratingFields) || this.state !== nextState;
  }

  getInitialRateValue = field => {
    const { username } = this.props;
    const voter = field.rating_votes && field.rating_votes.find(rate => rate.voter === username);
    return voter ? ratePercent.indexOf(voter.rate) + 1 : 0;
  };

  handleOnClick = field => () => {
    this.setState({
      field,
    });
    this.toggleModal();
  };

  toggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  rateDescription = field => {
    const { intl } = this.props;
    const yourVote = this.getInitialRateValue(field);

    if (yourVote) {
      return (
        <React.Fragment>
          {intl.formatMessage({ id: 'your_vote', defaultMessage: 'Your vote' })}
          {': '}
          {yourVote.toFixed(2)}
        </React.Fragment>
      );
    }
    return null;
  };

  render() {
    const { ratingFields, username } = this.props;
    const rankingList = sortBy(ratingFields, ['body']);

    return (
      <React.Fragment>
        {rankingList &&
          rankingList.map(field => (
            <div className="RateInfo__header" key={field.permlink}>
              <div>{field.body}</div>
              <div className="RateInfo__stars">
                {this.rateDescription(field) ? (
                  <BTooltip title={this.rateDescription(field)}>
                    <div
                      className="RateInfo__stars-container"
                      role="presentation"
                      data-field={JSON.stringify(field)}
                      onClick={this.handleOnClick(field)}
                    >
                      <Rate allowHalf disabled value={+averageRate(field)} />
                    </div>
                  </BTooltip>
                ) : (
                  <div
                    className="RateInfo__stars-container"
                    role="presentation"
                    data-field={JSON.stringify(field)}
                    onClick={this.handleOnClick(field)}
                  >
                    <Rate allowHalf disabled value={+averageRate(field)} />
                  </div>
                )}
                <div>({rateCount(field)})</div>
              </div>
            </div>
          ))}
        {this.state.showModal && (
          <RateObjectModal
            isVisible={this.state.showModal}
            ratingCategoryField={this.state.field}
            wobjId={this.props.authorPermlink}
            username={username}
            onCancel={this.toggleModal}
          />
        )}
      </React.Fragment>
    );
  }
}

export default RateInfo;
