import PropTypes from 'prop-types';
import React from 'react';
import { Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import '../ModalSignUp/ModalSignUp.less';
import SteemConnect from '../../../steemConnectAPI';

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

  responseFacebook = response => {
    console.log(response);
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
              <div>Sign In</div>
              <a href={SteemConnect.getLoginURL(this.props.next)}>
                <FormattedMessage id="login" defaultMessage="Log in" />
              </a>
              <div>
                <span>Or sign up woth</span>
                <GoogleLogin
                  clientId="623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com"
                  buttonText="Login"
                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                  cookiePolicy={'single_host_origin'}
                />
                <FacebookLogin
                  appId="754038848413420"
                  autoLoad
                  fields="name,email,picture"
                  callback={this.responseFacebook}
                />
              </div>
            </div>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default ModalSignIn;
