import PropTypes from 'prop-types';
import React from 'react';
import { Modal, Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import './ModalSignUp.less';
import { login } from '../../../auth/authActions';
import { setToken } from '../../../helpers/getToken';

@injectIntl
@connect(() => ({}), {
  login,
})
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
  responseGoogle = async response => {
    await setToken(response.accessToken, 'google');
    this.props.login();
  };

  responseFacebook = async response => {
    await setToken(response.accessToken, 'facebook');
    this.props.login();
  };

  getSignUpInfo = (imageLink, imageRoute, aim, result, features) => (
    <div className="SignUpCard">
      <div className="SignUpCard__line">
        <a href={imageRoute}>
          <img alt="linkLogo" src={`${imageLink}`} />
        </a>
      </div>
      <div className="SignUpCard__line">{aim}</div>
      <div className="SignUpCard__line">{result}</div>
      <div className="SignUpCard__line">{features}</div>
      <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
        <FormattedMessage id="signup" defaultMessage="Sign up" />
      </a>
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
        <Modal
          width={600}
          title=""
          visible={this.state.isOpen}
          onCancel={this.toggleModal}
          footer={null}
        >
          <div className="ModalSignUp">
            <h2 className="ModalSignUp__title">Registration</h2>

            {this.getSignUpInfo(
              'https://cdn.steemitimages.com/DQmernVC8CUupAFckxvE62oMYVJNAsK8YDLmyBzJnNLzH7S/steemit.png',
              process.env.SIGNUP_URL,
              this.props.intl.formatMessage({
                id: 'newSteemAcc',
                defaultMessage: 'New Steem Account',
              }),
              this.props.intl.formatMessage({
                id: 'longerWaiting',
                defaultMessage: 'Waiting time up to 2 weeks',
              }),
              this.props.intl.formatMessage({
                id: 'emailAndPhoneReq',
                defaultMessage: 'Email and Phone Required',
              }),
            )}
            <div className="ModalSignUp__social">
              <div className="ModalSignUp__subtitle">Or sign up with</div>
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
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

ModalSignUp.propTypes = {
  login: PropTypes.func,
};

ModalSignUp.defaultProps = {
  login: () => {},
};

export default ModalSignUp;
