interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <div className="mb-8">
    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">{title}</h1>
    {subtitle && <p className="text-gray-600 max-w-2xl">{subtitle}</p>}
  </div>
);

export default PageHeader;
