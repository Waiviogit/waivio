import React, { Component } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { FormattedMessage } from 'react-intl';
import apiConfig from '../../waivioApi/routes';
import { subscribeTypes } from '../../common/constants/blockTypes';

import './widgetsStyle.less';

export function getDisplayName(ComposedComponent) {
  if (ComposedComponent.displayName) {
    return ComposedComponent.displayName;
  }

  return ComposedComponent.name || 'NameLessComponent';
}

const ErrorBoundary = ComposedComponent => {
  class WrapperComponent extends Component {
    state = {
      hasError: false,
      error: '',
    };

    componentDidCatch(error, info) {
      this.setState({
        hasError: true,
      });

      if (typeof WebSocket !== 'undefined' && !location.href?.includes('localhost')) {
        const socket = new WebSocket(
          `wss://${apiConfig[process.env.NODE_ENV].host}/notifications-api`,
        );

        const errorReport = JSON.stringify(
          {
            message: error?.message || String(error),
            name: error?.name,
            stack: error?.stack,
            componentStack: info?.componentStack,
            url: location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        );

        const errorReportAsCode = `\`\`\`json\n${errorReport}\n\`\`\``;

        setTimeout(() => {
          if (socket.readyState === WebSocket.OPEN) {
            try {
              socket.send(
                JSON.stringify({
                  method: subscribeTypes.clientError,
                  params: ['user', `Page crashed, report:\n${errorReportAsCode}`],
                }),
              );
            } catch (e) {
              console.error('Error sending error report via WebSocket:', e);
            }
          } else {
            console.warn('WebSocket not ready for error report, skipping...');
          }
        }, 300);
      }
    }

    render() {
      const { hasError } = this.state;

      return !hasError ? (
        <ComposedComponent {...this.props} />
      ) : (
        <div className="errorBoundary">
          <img
            src={'/images/icons/errorBoundary.svg'}
            alt="errorBoundary"
            className="errorBoundary__image"
          />
          <span className="errorBoundary__mainText">
            <FormattedMessage id="error_boundary_page" defaultMessage="Something went wrong" />
          </span>
          <span className="errorBoundary__secondaryText">
            <FormattedMessage
              id="error_boundary_page_brace"
              defaultMessage="Brace yourself till we get the error fixed."
            />
          </span>
          <span className="errorBoundary__secondaryText">
            <FormattedMessage
              id="error_boundary_page_try_reload"
              defaultMessage="You may also refresh the page or try again later."
            />
          </span>
          <span className="errorBoundary__secondaryText">
            <FormattedMessage
              id="error_boundary_page_go_to"
              defaultMessage="You can head back to"
            />
            <a href="/" className="errorBoundary__link">
              <FormattedMessage id="error_boundary_page_home" defaultMessage="the home page." />
            </a>
          </span>
        </div>
      );
    }
  }

  WrapperComponent.displayName = `ErrorBoundary(${getDisplayName(ComposedComponent)})`;

  return hoistNonReactStatics(WrapperComponent, ComposedComponent);
};

export default ErrorBoundary;
