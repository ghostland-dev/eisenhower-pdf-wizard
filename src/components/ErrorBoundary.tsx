import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">
              Oups, une erreur est survenue
            </h1>
            <p className="text-muted-foreground">
              L'application a rencontré une erreur inattendue. Vos données sont sauvegardées localement.
            </p>
            {this.state.error && (
              <details className="text-left text-sm bg-muted p-4 rounded">
                <summary className="cursor-pointer font-medium mb-2">
                  Détails de l'erreur
                </summary>
                <p className="text-destructive">{this.state.error.message}</p>
              </details>
            )}
            <Button onClick={this.handleReset} className="w-full">
              Recharger l'application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
