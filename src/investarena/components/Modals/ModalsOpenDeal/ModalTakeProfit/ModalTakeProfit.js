import { Modal } from 'antd';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { currencyFormat } from '../../../../platform/numberFormat';
import { quoteFormat } from '../../../../platform/parsingPrice';
import ModalTakeProfitBody from './ModalTakeProfitBody';
import './ModalTakeProfit.less';

const propTypes = {
  quote: PropTypes.object,
  quoteSettings: PropTypes.object,
  openDeal: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired
};

class ModalTakeProfit extends Component {
    constructor (props) {
        super(props);
        this.state = {modal: false};
    }
    toggle = () => {
        this.setState({modal: !this.state.modal});
    };
    render () {
        let buttonText = this.props.intl.formatMessage({ id: 'deals.takeProfit', defaultMessage: 'Take profit' });
        if (this.props.openDeal.takeProfitPrice) {
            buttonText = quoteFormat(this.props.openDeal.takeProfitPrice / 1000000, this.props.quoteSettings);
        } else if (this.props.openDeal.takeProfitAmount) {
            buttonText = currencyFormat(this.props.openDeal.takeProfitAmount / 1000000);
        }
        return (
            <div className='st-open-deal-button-wrap'>
                <button id="modalTakeProfitOpen" className='btn st-open-deal-button-blue' onClick={this.toggle}>
                    {this.props.openDeal.takeProfitAmount || this.props.openDeal.takeProfitPrice ? <span>TP: </span> : null}{buttonText}
                </button>
                {this.state.modal &&
                  <Modal
                    title={this.props.intl.formatMessage({ id: 'modalTakeProfit.header.title', defaultMessage: 'Take profit' })}
                    visible={this.state.modal}
                    footer={null}
                    onCancel={this.toggle}
                    style={{width: '250px'}}
                  >
                    <ModalTakeProfitBody
                      openDeal = {this.props.openDeal}
                      quote = {this.props.quote}
                      quoteSettings = {this.props.quoteSettings}
                      // showNotification = {this.props.showNotification}
                      toggle = {this.toggle}
                    />
                  </Modal>
                }
            </div>
        );
    }
}

ModalTakeProfit.propTypes = propTypes;

export default injectIntl(ModalTakeProfit);
