import { Modal } from 'antd';
import { injectIntl } from 'react-intl';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { closeOpenDealPlatform } from '../../../../redux/actions/dealsActions';
import './ModalClose.less';

const propTypes = {
  openDealId: PropTypes.string.isRequired,
  openDealSequenceNumber: PropTypes.number.isRequired,
};

class ModalClose extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: false };
  }
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  handleClickConfirmCloseDeal = () => {
    closeOpenDealPlatform(this.props.openDealId);
    this.toggle();
  };
  render() {
    return (
      <div className="st-open-deal-button-wrap st-margin-left-large">
        <button id="closeModalOpen" className="btn st-open-deal-button-red" onClick={this.toggle}>
          {this.props.intl.formatMessage({ id: 'deals.close', defaultMessage: 'Close' })}
        </button>
        {this.state.modal && (
          <Modal
            title={this.props.intl.formatMessage({
              id: 'deals.closeAll',
              defaultMessage: 'Close all',
            })}
            visible={this.state.modal}
            footer={null}
            onCancel={this.toggle}
            style={{ width: '250px' }}
          >
            <span className="modal-text st-margin-bottom-large">
              {this.props.intl.formatMessage({
                id: 'modalClose.header.title',
                defaultMessage: 'Close Deal',
              })}
              <span>&ensp;{`${this.props.openDealSequenceNumber}?`} </span>
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
                onClick={this.handleClickConfirmCloseDeal}
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

ModalClose.propTypes = propTypes;

export default injectIntl(ModalClose);
