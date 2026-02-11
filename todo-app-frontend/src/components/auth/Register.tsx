import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../../features/auth/authSlice';
import { validatePasswordStrength } from '../../utils/passwordValidation';
import type { RootState, AppDispatch } from '../../app/store';

const MIN_LEN = 8;
const hasMinLength = (p: string) => p.length >= MIN_LEN;
const hasUpperCase = (p: string) => /[A-Z]/.test(p);
const hasLowerCase = (p: string) => /[a-z]/.test(p);
const hasNumber = (p: string) => /\d/.test(p);
const hasSpecial = (p: string) => /[!@#$%^&*()_+\-=[\]{}|;':",./<>?\\`~]/.test(p);

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { name, email, password, confirmPassword } = formData;
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );
  
  useEffect(() => {
    if (isError) {
      alert(message);
    }
    
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };
  
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pwdValidation = validatePasswordStrength(password);
    if (!pwdValidation.valid) {
      alert(`Password must be strong: ${pwdValidation.message}`);
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userData = {
      name,
      email,
      password
    };

    dispatch(register(userData));
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
              <span className="text-white font-bold text-2xl">✓</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm">
              Join us and start organizing your tasks
            </p>
          </div>
          
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="John Doe"
                  value={name}
                  onChange={onChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={onChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={MIN_LEN}
                  className="input-field"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={onChange}
                />
                <p className="text-xs text-gray-500 mt-1.5 mb-1">Strong password requirements:</p>
                <ul className="text-xs text-gray-600 space-y-0.5 list-none">
                  <li className={hasMinLength(password) ? 'text-green-600' : ''}>{hasMinLength(password) ? '✓' : '○'} At least 8 characters</li>
                  <li className={hasUpperCase(password) ? 'text-green-600' : ''}>{hasUpperCase(password) ? '✓' : '○'} One uppercase letter</li>
                  <li className={hasLowerCase(password) ? 'text-green-600' : ''}>{hasLowerCase(password) ? '✓' : '○'} One lowercase letter</li>
                  <li className={hasNumber(password) ? 'text-green-600' : ''}>{hasNumber(password) ? '✓' : '○'} One number</li>
                  <li className={hasSpecial(password) ? 'text-green-600' : ''}>{hasSpecial(password) ? '✓' : '○'} One special character (!@#$%^&* etc.)</li>
                </ul>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={onChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

