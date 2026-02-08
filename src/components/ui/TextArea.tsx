import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-3 py-2.5 bg-input-bg border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors resize-none ${error ? 'border-status-declined' : ''} ${className}`}
          rows={4}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-status-declined">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
