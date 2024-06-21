// Toaster.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider } from "@/components/ui/toast";
import { toast, useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const ToastTestComponent = () => {
  const { toast } = useToast();

  const showToast = (variant) => {
    toast({
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
      description: `This is a ${variant} toast message.`,
      variant,
    });
  };

  return (
    <div>
      <button onClick={() => showToast('default')}>Show Default Toast</button>
      <button onClick={() => showToast('destructive')}>Show Destructive Toast</button>
      <button onClick={() => showToast('positive')}>Show Positive Toast</button>
    </div>
  );
};

const renderWithToastProvider = (ui) => {
  return render(
    <ToastProvider>
      {ui}
      <Toaster />
    </ToastProvider>
  );
};

describe('Toaster Component', () => {
  test('renders default variant toast', () => {
    renderWithToastProvider(<ToastTestComponent />);

    fireEvent.click(screen.getByText(/Show Default Toast/i));

    expect(screen.getByText(/Default Toast/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a default toast message./i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('border bg-background text-foreground');
  });

  test('renders destructive variant toast', () => {
    renderWithToastProvider(<ToastTestComponent />);

    fireEvent.click(screen.getByText(/Show Destructive Toast/i));

    expect(screen.getByText(/Destructive Toast/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a destructive toast message./i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('border-destructive bg-destructive text-destructive-foreground');
  });

  test('renders positive variant toast', () => {
    renderWithToastProvider(<ToastTestComponent />);

    fireEvent.click(screen.getByText(/Show Positive Toast/i));

    expect(screen.getByText(/Positive Toast/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a positive toast message./i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('border border-green-200 bg-green-200 text-green-800');
  });
});
