import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ModalSignIn from '../components/Navigation/ModlaSignIn/ModalSignIn';
import {
  getCurrentHost,
  getIsWaivio,
  getUsedLocale,
  getWebsiteColors,
  getWebsiteNameForHeader,
  getWebsiteParentHost,
} from '../../store/appStore/appSelectors';
import { getIsAuthenticated } from '../../store/authStore/authSelectors';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withAuthActions(WrappedComponent) {
  @connect(state => ({
    authenticated: getIsAuthenticated(state),
    isWaivio: getIsWaivio(state),
    domain: getWebsiteParentHost(state),
    host: getCurrentHost(state),
    websiteName: getWebsiteNameForHeader(state),
    usedLocale: getUsedLocale(state),
    colors: getWebsiteColors(state),
  }))
  class Wrapper extends React.Component {
    static propTypes = {
      authenticated: PropTypes.bool,
      isWaivio: PropTypes.bool,
      domain: PropTypes.string,
      host: PropTypes.string,
      websiteName: PropTypes.string,
      usedLocale: PropTypes.string,
      colors: PropTypes.shape({
        mapMarkerBody: PropTypes.string,
      }),
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
      } else if (this.props.isWaivio || !this.props.domain) {
        this.displayLoginModal();
      } else {
        const path =
          window && window.location.pathname === '/' ? '' : window && window.location.pathname;
        const color = this.props.colors.mapMarkerBody?.replace('#', '');

        if (typeof window !== 'undefined')
          window.location.href = `https://${this.props.domain}/sign-in?host=${
            this.props.host
          }${path}&color=${color}&usedLocale=${this.props.usedLocale}&websiteName=${this.props
            .websiteName || this.props.host}`;
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
