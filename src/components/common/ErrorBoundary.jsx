// src/components/ErrorBoundary.jsx
import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-red-600">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || "An unexpected error occurred."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
