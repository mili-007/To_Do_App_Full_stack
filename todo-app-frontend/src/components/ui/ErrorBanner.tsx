interface ErrorBannerProps {
  message: string;
  show?: boolean;
}

const ErrorBanner = ({ message, show = true }: ErrorBannerProps) => {
  if (!show || !message) return null;
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
      {message}
    </div>
  );
};

export default ErrorBanner;
