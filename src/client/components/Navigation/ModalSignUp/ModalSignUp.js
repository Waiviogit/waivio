import PropTypes from 'prop-types';
import React from 'react';
import { Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
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
    this.openNinjaModal = this.openNinjaModal.bind(this);
  }

  componentDidMount() {
    const script = document.createElement('script');

    script.src = 'https://widget.steem.ninja/ninja.js';
    // script.async = true;

    document.body.appendChild(script);
  }

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

  openNinjaModal = () => {
    this.authorizeViaNinja.click();
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <React.Fragment>
        <div>
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
          <a
            ref={a => {
              this.authorizeViaNinja = a;
            }}
            title="Register a Waivio Account"
            data-name="Waivio"
            data-image="https://cdn.steemitimages.com/DQmWxwUb1hpd3X2bSL9VrWbJvNxKXDS2kANWoGTkwi4RdwV/unknown.png"
            data-referrer="waivio"
            href="https://widget.steem.ninja/widget.html?referrer=waivio"
            className="ninja-widget"
          />
        </div>
        {this.props.isButton ? (
          <button onClick={this.toggleModal} className="ModalSignUp__button">
            <FormattedMessage id="signup" defaultMessage="Sign up" />
          </button>
        ) : (
          <a role="presentation" onClick={this.toggleModal}>
            {this.props.intl.formatMessage({
              id: 'signUp',
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
              {this.getSignUpInfo(
                'https://cdn.steemitimages.com/DQmdbfH5akvanZk8Ntw92iEgcREkV8kv4uqxioTxDJLrHwD/steem-ninja.png',
                'https://account.steem.ninja/?ref=waivio',
                '$2.50',
                this.props.intl.formatMessage({
                  id: 'newSteemAcc',
                  defaultMessage: 'New Steem Account',
                }),
                this.props.intl.formatMessage({
                  id: 'instAccountCreation',
                  defaultMessage: 'Instant Account Creation',
                }),
                this.props.intl.formatMessage({
                  id: 'bonusDelegation',
                  defaultMessage: 'BONUS: 15 SP delegation (for 90 days)',
                }),
                true,
              )}
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
