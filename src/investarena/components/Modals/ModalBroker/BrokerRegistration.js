import { Button, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import React, { Component } from 'react';
// import classnames from 'classnames';
import PropTypes from 'prop-types';
// import Select from 'react-select';
import {validateRegexWithTooltip, validateConfirmPasswordWithTooltip,
validateInputNumber, validateMobileCode} from '../../../validate/validate';
import { agreements } from '../../../configApi/licenseAgreements';
import { country } from '../../../constants/countryData';
// import { getCountryCode } from '../../../redux/actions/authenticate/registration';
import LoadingSpinner from '../../../components/LoadingSpinner';
// import { phoneCode } from '../../../constants/phoneCodeData';
import {validateRegistrationSignIn} from '../../../constants/constansValidate';

const propTypes = {
    isLoading: PropTypes.bool.isRequired,
    registerBroker: PropTypes.func.isRequired,
    authorizeBroker: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

class BrokerRegistration extends Component {
    constructor (props) {
        super(props);
        this.state = {
            selectedPlatform: 'umarkets',
            activeTab: '1',
            optionsCountry: [],
            firstName: '',
            lastName: '',
            email: '',
            mobileCode: '',
            mobileNumber: '',
            selectCountry: null,
            password: '',
            confirmPassword: '',
            buttonDisabledState: true,
            showPassword: false,
            showConfirmPassword: false,
            agreementsLink: agreements.umarkets
        };
        this.handleChangePlatform = this.handleChangePlatform.bind(this);
        this.sendForm = this.sendForm.bind(this);
        this.updateValueCountry = this.updateValueCountry.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeAgreement = this.handleChangeAgreement.bind(this);
    }
    componentDidMount () {
        let optionsCountry = [];
        Object.keys(country['ru']).map((code) => {
            optionsCountry.push({value: code, label: country['ru'][code]});
        });
        // getCountryCode().then((data) => {
        //     // this.setState({optionsCountry: optionsCountry, selectCountry: data, mobileCode: `+${phoneCode[data]}`});
        // });
        this.inputs = {};
        this.btnSignUp = this.buttonSignUp;
        this.inputs.firstNameInput = this.firstName;
        this.inputs.lastNameInput = this.lastName;
        this.inputs.emailInput = this.email;
        this.inputs.mobileCodeInput = this.mobileCode;
        this.inputs.mobileInput = this.mobileNumber;
        this.inputs.passwordInput = this.password;
        this.inputs.confirmPasswordInput = this.confirmPassword;
        Object.keys(this.inputs).forEach((key) => {
            validateRegexWithTooltip(this.inputs[key], 'change', validateRegistrationSignIn[this.inputs[key].getAttribute('data-validate')]);
        });
        validateMobileCode(this.inputs.mobileCodeInput, 'input');
        validateInputNumber(this.inputs.mobileCodeInput, 'keypress');
        validateInputNumber(this.inputs.mobileInput, 'keypress');
        validateConfirmPasswordWithTooltip(this.inputs.passwordInput, this.inputs.confirmPasswordInput, 'change');
    }
    handleChangePlatform (tab, platform) {
        if (this.state.selectedPlatform !== tab) {
            this.setState({
                activeTab: tab,
                selectedPlatform: platform,
                agreementsLink: agreements[platform]
            });
        }
    }
    updateValueCountry (value) {
        this.setState({selectCountry: value});
    }
    sendForm (event) {
        event.preventDefault();
        let isValid = true;
        Object.keys(this.inputs).forEach((key) => {
            if (this.inputs[key].value === '') {
                this.inputs[key].classList.add('st-input-danger');
                this.inputs[key].parentElement.setAttribute('data-tooltip', this.inputs[key].getAttribute('data-empty'));
                isValid = false;
            } else if (this.inputs[key].classList.contains('st-input-danger')) {
                isValid = false;
            }
        });
        if (isValid) {
            this.setState({buttonDisabledState: true});
            const phoneOperator = this.state.mobileNumber.slice(0, 4);
            const phoneNumber = this.state.mobileNumber.slice(4, 9);
            const phoneCountry = this.state.mobileCode.slice(1);
            const registrationData = {
                broker_name: this.state.selectedPlatform,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                country: this.state.selectCountry,
                phoneCountry: phoneCountry,
                phoneOperator: phoneOperator,
                phoneNumber: phoneNumber
            };
            const authorizationData = {
                broker_name: this.state.selectedPlatform,
                email: this.state.email,
                password: this.state.password
            };
            this.props.registerBroker(registrationData, authorizationData);
        }
    }
    handleInputChange (event) {
        const newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }
    handleChangeAgreement (event) {
        this.setState({buttonDisabledState: !event.target.checked });
    }
    showPassword = (identifier) => {
        this.setState({[identifier]: !this.state[identifier]});
    };
    render () {
        return (
            <div className="st-broker-registration">
                {this.props.isLoading && <LoadingSpinner size="small"/>}
                {/*<Nav tabs className="st-broker-registration-nav">*/}
                    {/*<NavItem className="st-broker-registration-nav-item">*/}
                        {/*<NavLink*/}
                            {/*id='umarketsOption'*/}
                            {/*className={classnames({ active: this.state.activeTab === '1' })}*/}
                            {/*onClick={() => { this.handleChangePlatform('1', 'umarkets') }}>*/}
                            {/*<img className="st-broker-image" src="/static/images/umarkets-logo.png"/>*/}
                            {/*<div className="st-broker-languages">*/}
                                {/*<span>*/}
                                    {/*English*/}
                                    {/*Español*/}
                                    {/*العربية*/}
                                {/*</span>*/}
                            {/*</div>*/}
                        {/*</NavLink>*/}
                    {/*</NavItem>*/}
                    {/*<NavItem className="st-broker-registration-nav-item">*/}
                        {/*<NavLink*/}
                            {/*id='maximarketsOption'*/}
                            {/*className={classnames({ active: this.state.activeTab === '2' })}*/}
                            {/*onClick={() => { this.handleChangePlatform('2', 'maximarkets') }}>*/}
                            {/*<img className="st-broker-image" src="/static/images/maximarkets-logo.png"/>*/}
                            {/*<div className="st-broker-languages">*/}
                                {/*<span>*/}
                                    {/*English*/}
                                    {/*Русский*/}
                                {/*</span>*/}
                            {/*</div>*/}
                        {/*</NavLink>*/}
                    {/*</NavItem>*/}
                {/*</Nav>*/}
                <Form onSubmit={this.sendForm} className="st-broker-registration-form">
                    <div className="d-flex st-field-div">
                        <div className="st-half-block st-margin-right-small" data-position="left">
                            <FormattedMessage id="registrationForm.firstNamePlaceholder">
                                {msg => (
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        maxLength={200}
                                        value={this.state.firstName}
                                        ref = {(input) => this.firstName = input}
                                        className="field"
                                        placeholder={msg}
                                        onChange={this.handleInputChange}
                                        data-validate="firstName"
                                        data-title={this.props.intl.formatMessage({ id: 'tooltip.nameValid' })}
                                        data-empty={this.props.intl.formatMessage({ id: 'tooltip.empty' })}/>
                                )}
                            </FormattedMessage>
                        </div>
                        <div className="st-half-block st-margin-left-small" data-position="right">
                            <FormattedMessage id="registrationForm.lastNamePlaceholder">
                                {msg => (
                                    <input
                                        name="lastName"
                                        maxLength={200}
                                        value={this.state.lastName}
                                        ref = {(input) => this.lastName = input}
                                        className="field"
                                        placeholder={msg}
                                        onChange={this.handleInputChange}
                                        data-validate="lastName"
                                        data-title={this.props.intl.formatMessage({ id: 'tooltip.lastnameValid' })}
                                        data-empty={this.props.intl.formatMessage({ id: 'tooltip.empty' })}/>
                                )}
                            </FormattedMessage>
                        </div>
                    </div>
                    <div className="st-field-div" data-position="left">
                        <FormattedMessage id="registrationForm.emailPlaceholder">
                            {msg => (
                                <input
                                    name="email"
                                    maxLength={256}
                                    value={this.state.email}
                                    ref = {(input) => this.email = input}
                                    className="field"
                                    placeholder={msg}
                                    onChange={this.handleInputChange}
                                    data-validate="email"
                                    data-title={this.props.intl.formatMessage({ id: 'tooltip.emailValid' })}
                                    data-empty={this.props.intl.formatMessage({ id: 'tooltip.empty' })}/>
                            )}
                        </FormattedMessage>
                    </div>
                    <div className="d-flex st-field-div">
                        <div className="st-form-mobile-code-block" data-position="left">
                            <input
                                required
                                minLength={2}
                                maxLength={5}
                                ref = {(input) => this.mobileCode = input}
                                name="mobileCode"
                                value={this.state.mobileCode}
                                className="field"
                                placeholder="+380"
                                onChange={this.handleInputChange}
                                data-validate="phoneCountry"
                                data-title={this.props.intl.formatMessage({ id: 'tooltip.phoneValid' })}
                                data-empty={this.props.intl.formatMessage({ id: 'tooltip.empty' })}/>
                        </div>
                        <div className="st-form-mobile-block" data-position="right">
                            <FormattedMessage id="registrationForm.mobilePlaceholder">
                                {msg => (
                                    <input
                                        maxLength={11}
                                        minLength={6}
                                        name="mobileNumber"
                                        value={this.state.mobileNumber}
                                        ref = {(input) => this.mobileNumber = input}
                                        className="field"
                                        placeholder={msg}
                                        onChange={this.handleInputChange}
                                        data-validate="phoneNumber"
                                        data-title={this.props.intl.formatMessage({ id: 'tooltip.phoneValid' })}
                                        data-empty={this.props.intl.formatMessage({ id: 'tooltip.empty' })}/>
                                )}
                            </FormattedMessage>
                        </div>
                    </div>
                    {/*<Select*/}
                        {/*name="selected-country"*/}
                        {/*className="st-broker-select-country"*/}
                        {/*options={this.state.optionsCountry}*/}
                        {/*inputProps={{ maxLength: 25 }}*/}
                        {/*simpleValue*/}
                        {/*clearable={false}*/}
                        {/*value={this.state.selectCountry}*/}
                        {/*onChange={this.updateValueCountry}/>*/}
                    <div className="d-flex st-field-div">
                        <div className="st-half-block st-margin-right-small" data-position="left">
                            <FormattedMessage id="registrationForm.passwordPlaceholder">
                                {msg => (
                                    <input
                                        name="password"
                                        type={this.state.showPassword ? 'text' : 'password'}
                                        value={this.state.password}
                                        ref = {(input) => this.password = input}
                                        className="field"
                                        placeholder={msg}
                                        onChange={this.handleInputChange}
                                        data-validate="password"
                                        data-title={this.props.intl.formatMessage({ id: 'tooltip.passwordBrokerValid' })}
                                        data-empty={this.props.intl.formatMessage({ id: 'tooltip.empty' })}/>
                                )}
                            </FormattedMessage>
                            <img title={this.props.intl.formatMessage({ id: `${this.state.showPassword ? 'password.hidePasswords' : 'password.showPasswords'}` })}
                                className="st-eye-icon" src={this.state.showPassword ? '/static/images/icons/eyeDark.svg' : '/static/images/icons/eye.svg'}
                                onClick={this.showPassword.bind(this, 'showPassword')}/>
                        </div>
                        <div className="st-half-block st-margin-left-small" data-position="right">
                            <FormattedMessage id="registrationForm.confirmPasswordPlaceholder">
                                {msg => (
                                    <input
                                        name="confirmPassword"
                                        type={this.state.showConfirmPassword ? 'text' : 'password'}
                                        value={this.state.confirmPassword}
                                        ref = {(input) => this.confirmPassword = input}
                                        className="field"
                                        placeholder={msg}
                                        onChange={this.handleInputChange}
                                        data-validate="password"
                                        data-confirmation={this.props.intl.formatMessage({ id: 'tooltip.passwordConfirmation' })}
                                        data-empty={this.props.intl.formatMessage({ id: 'tooltip.empty' })}/>
                                )}
                            </FormattedMessage>
                            <img title={this.props.intl.formatMessage({ id: `${this.state.showConfirmPassword ? 'password.hidePasswords' : 'password.showPasswords'}` })}
                                className="st-eye-icon" src={this.state.showConfirmPassword ? '/static/images/icons/eyeDark.svg' : '/static/images/icons/eye.svg'}
                                onClick={this.showPassword.bind(this, 'showConfirmPassword')}/>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="checkbox-wrapper st-correct-wrapper"><input
                            type="checkbox"
                            className="st-broker-checkbox"
                            onChange={this.handleChangeAgreement}/>
                        <div className="checkbox">
                            <img src="/static/images/icons/checkmark.svg"/>
                        </div>
                        </div>
                        <span><FormattedMessage id="modalBroker.readTerms"/><a href={this.state.agreementsLink} target="_blank" className="st-margin-left-small"><FormattedMessage id="modalBroker.terms"/></a></span>
                    </div>
                    <Button
                        className="st-broker-button"
                        color="primary"
                        ref = {(button) => this.buttonSignUp = button}
                        onSubmit={this.sendForm}
                        disabled={this.state.buttonDisabledState}><FormattedMessage id="registrationButton.registrationText"/></Button>
                </Form>
            </div>
        );
    }
}

BrokerRegistration.propTypes = propTypes;

export default injectIntl(BrokerRegistration);
