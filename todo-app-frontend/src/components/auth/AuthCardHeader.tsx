interface AuthCardHeaderProps {
  title: string;
  subtitle: string;
}

const AuthCardHeader = ({ title, subtitle }: AuthCardHeaderProps) => (
  <div className="text-center mb-8">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
      <span className="text-white font-bold text-2xl" aria-hidden>✓</span>
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

export default AuthCardHeader;
