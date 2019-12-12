import PropTypes from 'prop-types';
import React from 'react';
import { Modal, Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import './ModalSignUp.less';

@injectIntl
class ModalSignUp extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    isButton: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  responseGoogle = response => {
    console.log(response);
  };

  responseFacebook = response => {
    console.log(response);
  };

  getSignUpInfo = (imageLink, imageRoute, price, aim, result, features, isNinja) => (
    <div className="SignUpCard">
      <div className="SignUpCard__line">
        <a href={imageRoute}>
          <img alt="linkLogo" src={`${imageLink}`} />
        </a>
      </div>

      <div className="SignUpCard__line SignUpCard__text-price">{price}</div>
      <div className="SignUpCard__line">{aim}</div>
      <div className="SignUpCard__line">{result}</div>
      <div className="SignUpCard__line">{features}</div>
      {isNinja ? (
        <a role="presentation" onClick={this.openNinjaModal}>
          <FormattedMessage id="signup" defaultMessage="Sign up" />
        </a>
      ) : (
        <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
          <FormattedMessage id="signup" defaultMessage="Sign up" />
        </a>
      )}
    </div>
  );

  toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <React.Fragment>
        {this.props.isButton ? (
          <button onClick={this.toggleModal} className="ModalSignUp__button">
            <FormattedMessage id="signup" defaultMessage="Sign up" />
          </button>
        ) : (
          <a role="presentation" onClick={this.toggleModal}>
            {this.props.intl.formatMessage({
              id: 'signup',
              defaultMessage: 'Sign up',
            })}
          </a>
        )}
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        {this.state.isOpen && (
          <Modal
            width={600}
            title=""
            visible={this.state.isOpen}
            onCancel={this.toggleModal}
            footer={null}
          >
            <div className="ModalSignUp">
              <div>Registration</div>
              <div className="ModalSignUp__social">
                <div>Or sign up with</div>
                <GoogleLogin
                  clientId="623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com"
                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                  cookiePolicy={'single_host_origin'}
                  className="ModalSignUp__social-btn"
                />
                <FacebookLogin
                  appId="754038848413420"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={this.responseFacebook}
                  textButton="Sign In with Facebook"
                  cssClass="ModalSignUp__social-btn ModalSignUp__social-btn--fb"
                  icon={<Icon type="facebook" className="ModalSignUp__icon-fb" />}
                />
              </div>
              {this.getSignUpInfo(
                'https://cdn.steemitimages.com/DQmernVC8CUupAFckxvE62oMYVJNAsK8YDLmyBzJnNLzH7S/steemit.png',
                process.env.SIGNUP_URL,
                'Free',
                this.props.intl.formatMessage({
                  id: 'newSteemAcc',
                  defaultMessage: 'New Steem Account',
                }),
                this.props.intl.formatMessage({
                  id: 'longerWaiting',
                  defaultMessage: 'Longer waiting time (up to 2 weeks)"',
                }),
                this.props.intl.formatMessage({
                  id: 'emailAndPhoneReq',
                  defaultMessage: 'Email and Phone Required',
                }),
                false,
              )}
            </div>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default ModalSignUp;
