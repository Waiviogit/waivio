import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsAuthenticated, getIsWaivio, getWebsiteParentHost } from '../reducers';
import ModalSignIn from '../components/Navigation/ModlaSignIn/ModalSignIn';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withAuthActions(WrappedComponent) {
  @connect(state => ({
    authenticated: getIsAuthenticated(state),
    isWaivio: getIsWaivio(state),
    domain: getWebsiteParentHost(state),
  }))
  class Wrapper extends React.Component {
    static propTypes = {
      authenticated: PropTypes.bool,
      isWaivio: PropTypes.bool,
      domain: PropTypes.string,
    };

    static defaultProps = {
      authenticated: false,
      isWaivio: true,
      domain: '',
      host: '',
    };

    constructor(props) {
      super(props);
      this.state = {
        displayLoginModal: false,
      };

      this.handleActionInit = this.handleActionInit.bind(this);
      this.displayLoginModal = this.displayLoginModal.bind(this);
      this.hideLoginModal = this.hideLoginModal.bind(this);
    }

    displayLoginModal() {
      this.setState({
        displayLoginModal: true,
      });
    }

    hideLoginModal() {
      this.setState({
        displayLoginModal: false,
      });
    }

    handleActionInit(callback) {
      if (this.props.authenticated) {
        callback();
      } else if (this.props.isWaivio) {
        this.displayLoginModal();
      } else {
        window.location.href = `https://${this.props.domain}/sign-in?host=${window.location.href}`;
      }
    }

    render() {
      return [
        <ModalSignIn
          isButton={false}
          showModal={this.state.displayLoginModal}
          handleLoginModalCancel={this.hideLoginModal}
          hideLink
          key="modal-sign-in"
        />,
        <WrappedComponent
          key="wrapped-component"
          onActionInitiated={this.handleActionInit}
          {...this.props}
        />,
      ];
    }
  }

  Wrapper.displayName = `withAuthActions(${getDisplayName(WrappedComponent)})`;

  return Wrapper;
}
