import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsAuthenticated, getIsLoaded } from '../reducers';
import ModalSignIn from '../components/Authorization/ModalSignIn/ModalSignIn';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withAuthActions(WrappedComponent) {
  @connect(state => ({
    authenticated: getIsAuthenticated(state),
    loaded: getIsLoaded(state),
  }))
  class Wrapper extends React.Component {
    static propTypes = {
      authenticated: PropTypes.bool,
      loaded: PropTypes.bool.isRequired,
    };

    static defaultProps = {
      authenticated: false,
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

    hideLoginModal(callback) {
      this.setState({
        displayLoginModal: false,
      });
      if (callback) callback();
    }

    handleActionInit(callback) {
      if (this.props.authenticated) {
        callback();
      } else {
        this.displayLoginModal();
      }
    }

    render() {
      return [
        <ModalSignIn
          key="modal-signin"
          visible={this.state.displayLoginModal}
          isAuth={this.props.authenticated}
          isLoaded={this.props.loaded}
          hideModal={this.hideLoginModal}
          isAuthAction
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
