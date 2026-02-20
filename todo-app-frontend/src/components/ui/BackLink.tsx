import { Link } from 'react-router-dom';

interface BackLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const BackLink = ({ to, children, className = '' }: BackLinkProps) => (
  <Link
    to={to}
    className={`inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-4 ${className}`}
  >
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    {children}
  </Link>
);

export default BackLink;
