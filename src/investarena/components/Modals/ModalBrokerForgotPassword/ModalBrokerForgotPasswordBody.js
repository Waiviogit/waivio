import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import Select from 'react-select';
import { optionsPlatform } from '../../../constants/selectData';
import { validateRegexWithTooltip } from '../../../validate/validate';
import { validateRegistrationSignIn } from '../../../constants/constansValidate';
import './ModalBrokerForgotPassword.less';

class ModalBrokerForgotPasswordBody extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedPlatform: 'umarkets' };
  }
  updateSelectedPlatform = event => {
    if (this.state.selectedPlatform !== event.value) {
      this.setState({ selectedPlatform: event.value });
    }
  };
  componentDidMount() {
    this.emailInput = document.querySelector('.st-modal-broker-forgot-password-input-email');
    if (this.emailInput) {
      validateRegexWithTooltip(
        this.emailInput,
        'change',
        validateRegistrationSignIn[this.emailInput.getAttribute('data-validate')],
      );
    }
  }
  handleClick = () => {
    let isValid = true;
    if (this.emailInput && this.emailInput.value === '') {
      this.emailInput.classList.add('st-input-danger');
      this.emailInput.parentElement.setAttribute(
        'data-tooltip',
        this.emailInput.getAttribute('data-empty'),
      );
      isValid = false;
    } else if (this.emailInput && this.emailInput.classList.contains('st-input-danger')) {
      isValid = false;
    }
    if (isValid) {
      const data = {
        broker_name: this.state.selectedPlatform,
        email: this.emailInput.value,
      };
      this.props.forgotPassBroker(data).then(() => {
        this.emailInput.value = '';
        this.props.toggle();
      });
    }
  };
  render() {
    return (
      <div>
        <div className="st-modal-broker-forgot-password-title h4">
          {this.props.intl.formatMessage({ id: 'modalBrokerForgotPassword.modalBody.title' })}
        </div>
        <div className="st-modal-broker-forgot-password-select">
          <Select
            className="st-modal-broker-forgot-password-platform"
            options={optionsPlatform}
            value={this.state.selectedPlatform}
            onChange={this.updateSelectedPlatform}
            clearable={false}
            searchable={false}
          />
        </div>
        <div className="st-modal-broker-forgot-password-input-wrap" data-position="top">
          <input
            className="field st-modal-broker-forgot-password-input-email"
            maxLength={256}
            type="email"
            placeholder={this.props.intl.formatMessage({
              id: 'modalBrokerForgotPassword.modalBody.emailPlaceholder',
            })}
            data-validate="email"
            data-title={this.props.intl.formatMessage({ id: 'tooltip.emailValid' })}
            data-empty={this.props.intl.formatMessage({ id: 'tooltip.empty' })}
          />
        </div>
        <button
          disabled={this.props.isLoading}
          onClick={this.handleClick}
          className="btn btn-primary st-modal-broker-forgot-password-button"
        >
          {this.props.intl.formatMessage({ id: 'modalBrokerForgotPassword.modalBody.button' })}
        </button>
      </div>
    );
  }
}

export default injectIntl(ModalBrokerForgotPasswordBody);
