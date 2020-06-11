import React, { Component } from 'react';

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
      const { hasError, error } = this.state;

      return !hasError ? (
        <ComposedComponent {...this.props} />
      ) : (
        <div className="error-boundary" style={{ color: 'red' }}>
          {`${getDisplayName(WrapperComponent)}: ${error.toString()}`}
        </div>
      );
    }
  }

  WrapperComponent.displayName = `ErrorBoundary(${getDisplayName(ComposedComponent)})`;

  return WrapperComponent;
};

export default ErrorBoundary;
