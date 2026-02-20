import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

const EmptyState = ({ icon, title, subtitle }: EmptyStateProps) => (
  <div className="card bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
        <span className="text-gray-400 [&_svg]:w-10 [&_svg]:h-10">{icon}</span>
      </div>
      <p className="text-gray-600 font-medium text-lg mb-2">{title}</p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  </div>
);

export default EmptyState;
