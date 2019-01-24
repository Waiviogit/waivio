import { Modal } from 'antd';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { currencyFormat } from '../../../../platform/numberFormat';
import { quoteFormat } from '../../../../platform/parsingPrice';
import withEditDeal from '../../../HOC/withEditDeal';
import ModalStopLossBody from "./ModalStopLossBody";
import './ModalStopLoss.less';

const propTypes = {
  quote: PropTypes.object,
  quoteSettings: PropTypes.object,
  openDeal: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired
};

class ModalStopLoss extends Component {
    constructor (props) {
        super(props);
        this.state = {modal: false};
    }
    toggle = () => {
        this.setState({modal: !this.state.modal});
    };
    render () {
        let buttonText = this.props.intl.formatMessage({ id: 'deals.stopLoss', defaultMessage: 'Stop loss' });
        if (this.props.openDeal.stopLossPrice) {
            buttonText = quoteFormat(this.props.openDeal.stopLossPrice / 1000000, this.props.quoteSettings);
        }
        if (this.props.openDeal.stopLossAmount) {
            buttonText = currencyFormat(this.props.openDeal.stopLossAmount / -1000000);
        }
        return (
            <div className='st-open-deal-button-wrap st-margin-left-large'>
                <button id="modalStopLossOpen" className='btn st-open-deal-button-blue' onClick={this.toggle}>
                    {(this.props.openDeal.stopLossPrice || this.props.openDeal.stopLossAmount) && <span>ST: </span>}
                    {buttonText}
                </button>
                {this.state.modal &&
                  <Modal
                    title={this.props.intl.formatMessage({ id: 'modalStopLoss.header.title', defaultMessage: 'Stop loss' })}
                    visible={this.state.modal}
                    footer={null}
                    onCancel={this.toggle}
                    style={{width: '250px'}}
                  >
                    <ModalStopLossBody
                      openDeal = {this.props.openDeal}
                      quoteSettings = {this.props.quoteSettings}
                      quote = {this.props.quote}
                      // showNotification = {this.props.showNotification}
                      toggle = {this.toggle}
                    />
                  </Modal>
                }
            </div>
        );
    }
}

ModalStopLoss.propTypes = propTypes;

export default injectIntl(ModalStopLoss);
