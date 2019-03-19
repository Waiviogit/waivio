import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Rate } from 'antd';
import { injectIntl } from 'react-intl';
import RateForm from './RateForm';
import StarRating from './StarRating';
import { averageRate, rateCount } from './rateHelper';
import { objectFields, ratePercent } from '../../../../common/constants/listOfFields';
import './RateInfo.less';

@injectIntl
class RateInfo extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    wobject: PropTypes.shape().isRequired,
  };

  state = {
    showModal: false,
    field: {},
  };

  getInitialRateValue = field => {
    const { username } = this.props;
    const voter = field.rating_votes && field.rating_votes.find(rate => rate.voter === username);
    return voter ? ratePercent.indexOf(voter.rate) + 1 : null;
  };

  handleOnClick = e => {
    this.setState({
      field: _.attempt(JSON.parse, e.target.dataset.field),
    });
    this.toggleModal();
  };

  toggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  render() {
    const { fields } = this.props.wobject;

    const filteredRatingFields = fields.filter(field => field.name === objectFields.rating);
    const rankingList = _.orderBy(filteredRatingFields, ['weight'], ['desc']);
    const ratingByCategoryFields = fields.find(
      field => field.permlink === this.state.field.permlink,
    );

    return (
      <React.Fragment>
        {rankingList &&
          rankingList.map(field => (
            <div className="RateInfo__header" key={field.permlink}>
              <div
                role="presentation"
                className="RateInfo__title"
                data-field={JSON.stringify(field)}
                key={field.permlink}
                onClick={this.handleOnClick}
              >
                {field.body}
              </div>
              <div className="RateInfo__stars">
                <div className="RateInfo__stars-container">
                  <Rate allowHalf disabled defaultValue={+averageRate(field)} />
                </div>
                <div>({rateCount(field)})</div>
              </div>
            </div>
          ))}
        {this.state.showModal && (
          <Modal
            destroyOnClose
            title={this.state.field.body}
            visible={this.state.showModal}
            footer={null}
            onCancel={this.toggleModal}
          >
            <RateForm
              initialValue={this.getInitialRateValue(ratingByCategoryFields) || 0}
              field={this.state.field}
              authorPermlink={this.props.wobject.author_permlink}
            />
            {this.getInitialRateValue(ratingByCategoryFields) && (
              <StarRating field={ratingByCategoryFields} />
            )}
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default RateInfo;
