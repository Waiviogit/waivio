import { Modal } from 'antd';
import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { closeOpenDealPlatform } from '../../../../redux/actions/dealsActions';
import './ModalCloseAll.less';

const propTypes = {
  title: PropTypes.string,
  allMarker: PropTypes.string,
  openDeals: PropTypes.object.isRequired,
  sumPnl: PropTypes.string.isRequired,
  buttonClass: PropTypes.string.isRequired,
};

class ModalCloseAll extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: false };
  }
  toggle = () => {
    if (this.props.sumPnl !== 0) this.setState({ modal: !this.state.modal });
  };
  handleClickConfirmCloseDeals = (openDeals, allMarker) => {
    _.map(openDeals, openDeal => {
      closeOpenDealPlatform(openDeal.dealId, allMarker);
    });
    this.toggle();
  };
  render() {
    return (
      <div className="st-open-deal-button-wrap st-margin-left-large">
        {_.size(this.props.openDeals) > 0 ? (
          <button className={this.props.buttonClass} onClick={this.toggle}>
            {`${this.props.intl.formatMessage({
              id: 'deals.closeAll',
              defaultMessage: 'Close all',
            })}: ${this.props.sumPnl}`}
          </button>
        ) : (
          <button className={`${this.props.buttonClass} st-disabled`} disabled={true}>
            {`${this.props.intl.formatMessage({
              id: 'deals.closeAll',
              defaultMessage: 'Close all',
            })}: 0`}
          </button>
        )}
        {this.state.modal && (
          <Modal
            title={`${this.props.intl.formatMessage({
              id: 'deals.closeAll',
              defaultMessage: 'Close all',
            })} ${this.props.title ? this.props.intl.formatMessage({ id: this.props.title }) : ''}`}
            visible={this.state.modal}
            footer={null}
            onCancel={this.toggle}
            style={{ width: '250px' }}
          >
            <span className="modal-text st-margin-bottom-large">
              {`${this.props.intl.formatMessage({
                id: 'deals.closeAll',
                defaultMessage: 'Close all',
              })}: ${this.props.sumPnl}`}
            </span>
            <div className="d-flex">
              <button className="btn st-open-deal-button-red" onClick={this.toggle}>
                {this.props.intl.formatMessage({
                  id: 'modal.button.cancel',
                  defaultMessage: 'Cancel',
                })}
              </button>
              <button
                className="btn st-open-deal-button-blue st-margin-left-large"
                onClick={this.handleClickConfirmCloseDeals.bind(
                  this,
                  this.props.openDeals,
                  this.props.allMarker,
                )}
              >
                {this.props.intl.formatMessage({ id: 'modal.button.yes', defaultMessage: 'OK' })}
              </button>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

ModalCloseAll.propTypes = propTypes;

export default injectIntl(ModalCloseAll);
