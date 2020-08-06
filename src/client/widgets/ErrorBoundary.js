import React, { Component } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export function getDisplayName(ComposedComponent) {
  if (ComposedComponent.displayName) {
    return ComposedComponent.displayName;
  }

  return ComposedComponent.name ? ComposedComponent.name : 'NameLessComponent';
}

const ErrorBoundary = ComposedComponent => {
  class WrapperComponent extends Component {
    state = {
      hasError: false,
      error: '',
    };

    componentDidCatch(error) {
      this.setState({
        hasError: true,
        error,
      });

      console.warn(error);
    }

    render() {
      const { hasError } = this.state;

      return hasError ? (
        <ComposedComponent {...this.props} />
      ) : (
        <div className="errorBoundary">
          <span className="errorBoundary__mainText">Something went wrong</span>
          <span className="errorBoundary__secondaryText">
            Brace yourself till we get the error fixed.
          </span>
          <span className="errorBoundary__secondaryText">
            {' '}
            You may also refresh the page or try again later
          </span>
        </div>
        // <div className="error-boundary" style={{ color: 'red' }}>
        //   {`${getDisplayName(WrapperComponent)}: ${error.toString()}`}
        // </div>
      );
    }
  }

  WrapperComponent.displayName = `ErrorBoundary(${getDisplayName(ComposedComponent)})`;

  return hoistNonReactStatics(WrapperComponent, ComposedComponent);
};

export default ErrorBoundary;
