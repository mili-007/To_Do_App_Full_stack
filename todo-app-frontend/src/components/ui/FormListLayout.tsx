import type { ReactNode } from 'react';
import PageHeader from './PageHeader';
import ErrorBanner from './ErrorBanner';

interface FormListLayoutProps {
  title: string;
  subtitle?: string;
  errorMessage?: string;
  showError?: boolean;
  formContent: ReactNode;
  listContent: ReactNode;
}

const FormListLayout = ({
  title,
  subtitle,
  errorMessage = '',
  showError = false,
  formContent,
  listContent
}: FormListLayoutProps) => (
  <div className="max-w-6xl mx-auto">
    <PageHeader title={title} subtitle={subtitle} />
    <ErrorBanner message={errorMessage} show={showError} />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 lg:sticky lg:top-24">{formContent}</div>
      <div className="lg:col-span-2">{listContent}</div>
    </div>
  </div>
);

export default FormListLayout;
