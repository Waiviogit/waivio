import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Rate } from 'antd';
import { injectIntl } from 'react-intl';
import RateForm from './RateForm';
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

  handleOnClick = field => {
    this.setState({
      field,
    });
    this.toggleModal();
  };

  toggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  render() {
    const { username, wobject } = this.props;
    const { fields } = wobject;
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
              <div>{field.body}</div>
              <div className="RateInfo__stars">
                <div
                  className="RateInfo__stars-container"
                  role="presentation"
                  data-field={JSON.stringify(field)}
                  onClick={this.handleOnClick.bind(this, field)} // eslint-disable-line react/jsx-no-bind
                >
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
            className="RateInfo__modal"
          >
            <RateForm
              initialValue={this.getInitialRateValue(ratingByCategoryFields) || 0}
              field={this.state.field}
              authorPermlink={this.props.wobject.author_permlink}
              username={username}
              wobject={wobject}
              ratingByCategoryFields={ratingByCategoryFields}
            />
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default RateInfo;
