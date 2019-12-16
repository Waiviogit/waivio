import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import '../ModalSignUp/ModalSignUp.less';
import SteemConnect from '../../../steemConnectAPI';
import { setToken } from '../../../helpers/getToken';

@injectIntl
class ModalSignIn extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    next: PropTypes.string.isRequired,
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

  responseFacebook = async response => {
    await setToken(response.accessToken, 'facebook');
    this.props.login();
  };

  toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <React.Fragment>
        <a role="presentation" onClick={this.toggleModal}>
          {this.props.intl.formatMessage({
            id: 'signin',
            defaultMessage: 'Sign In',
          })}
        </a>
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
              <h2 className="ModalSignUp__title">Sign In</h2>
              <a
                role="button"
                href={SteemConnect.getLoginURL(this.props.next)}
                className="ModalSignUp__signin"
              >
                <img
                  src="/images/icons/steemit.svg"
                  alt="steemit"
                  className="ModalSignUp__icon-steemit"
                />
                <FormattedMessage id="signin" defaultMessage="Sign in with SteemIt" />
              </a>
              <div className="ModalSignUp__social">
                <div className="ModalSignUp__subtitle">Or sign in with</div>
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
        )}
      </React.Fragment>
    );
  }
}

ModalSignIn.propTypes = {
  login: PropTypes.func,
};

ModalSignIn.defaultProps = {
  login: () => {},
};

export default ModalSignIn;
