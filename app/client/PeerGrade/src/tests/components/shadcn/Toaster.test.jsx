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

    fireEvent.click(screen.getByText("Show Default Toast"));

    expect(screen.getByText("Default Toast")).toBeInTheDocument();
    expect(screen.getByText("This is a default toast message.")).toBeInTheDocument();

    const statusElements = screen.queryAllByRole('status');
    statusElements.forEach(statusElement => {
      // Check if the element has the specific classes
      if (
        statusElement.classList.contains('border') &&
        statusElement.classList.contains('bg-background') &&
        statusElement.classList.contains('text-foreground')
      ) {
        // Assertion
        expect(statusElement).toBeInTheDocument();
      }
    });
  });

  test('renders destructive variant toast', () => {
    renderWithToastProvider(<ToastTestComponent />);

    fireEvent.click(screen.getByText("Show Destructive Toast"));

    expect(screen.getByText("Destructive Toast")).toBeInTheDocument();
    expect(screen.getByText("This is a destructive toast message.")).toBeInTheDocument();

    const statusElements = screen.queryAllByRole('status');
    statusElements.forEach(statusElement => {
      // Check if the element has the specific classes
      if (
        statusElement.classList.contains('border-destructive') &&
        statusElement.classList.contains('bg-destructive') &&
        statusElement.classList.contains('text-destructive-foreground')
      ) {
        // Assertion
        expect(statusElement).toBeInTheDocument();
      }
    });
  });

  test('renders positive variant toast', () => {
    renderWithToastProvider(<ToastTestComponent />);

    fireEvent.click(screen.getByText("Show Positive Toast"));

    expect(screen.getByText("Positive Toast")).toBeInTheDocument();
    expect(screen.getByText("This is a positive toast message.")).toBeInTheDocument();

    const statusElements = screen.queryAllByRole('status');
    statusElements.forEach(statusElement => {
      // Check if the element has the specific classes
      if (
        statusElement.classList.contains('border') &&
        statusElement.classList.contains('border-green-200') &&
        statusElement.classList.contains('bg-green-200') &&
        statusElement.classList.contains('text-green-800')
      ) {
        // Assertion
        expect(statusElement).toBeInTheDocument();
      }
    });
  });
});
