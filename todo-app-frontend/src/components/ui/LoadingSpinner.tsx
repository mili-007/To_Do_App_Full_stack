interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner = ({ className = '' }: LoadingSpinnerProps) => (
  <div className={`flex items-center justify-center py-12 ${className}`}>
    <div
      className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
      aria-label="Loading"
    />
  </div>
);

export default LoadingSpinner;
