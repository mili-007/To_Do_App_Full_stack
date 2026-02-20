import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../utils/toast';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../../features/auth/authSlice';
import { validatePasswordStrength } from '../../utils/passwordValidation';
import type { RootState, AppDispatch } from '../../app/store';
import AuthCardHeader from './AuthCardHeader';
import Button from '../ui/Button';
import Input from '../ui/Input';

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
    if (isError && message) toast.error(message);
    if (isSuccess || user) navigate('/dashboard');
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pwdValidation = validatePasswordStrength(password);
    if (!pwdValidation.valid) {
      toast.error(`Password must be strong: ${pwdValidation.message}`);
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    dispatch(register({ name, email, password }));
  };

  return (
    <>
      <AuthCardHeader
        title="Create Account"
        subtitle="Join us and start organizing your tasks"
      />
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-4">
          <Input
            type="text"
            name="name"
            label="Full Name"
            value={name}
            onChange={onChange}
            placeholder="John Doe"
            required
          />
          <Input
            type="email"
            name="email"
            label="Email address"
            value={email}
            onChange={onChange}
            placeholder="you@example.com"
            required
          />
          <div>
            <Input
              type="password"
              name="password"
              label="Password"
              value={password}
              onChange={onChange}
              placeholder="Create a strong password"
              required
              minLength={MIN_LEN}
            />
            <p className="text-xs text-gray-500 mt-1.5 mb-1">Strong password requirements:</p>
            <ul className="text-xs text-gray-600 space-y-0.5 list-none">
              <li className={hasMinLength(password) ? 'text-green-600' : ''}>
                {hasMinLength(password) ? '✓' : '○'} At least 8 characters
              </li>
              <li className={hasUpperCase(password) ? 'text-green-600' : ''}>
                {hasUpperCase(password) ? '✓' : '○'} One uppercase letter
              </li>
              <li className={hasLowerCase(password) ? 'text-green-600' : ''}>
                {hasLowerCase(password) ? '✓' : '○'} One lowercase letter
              </li>
              <li className={hasNumber(password) ? 'text-green-600' : ''}>
                {hasNumber(password) ? '✓' : '○'} One number
              </li>
              <li className={hasSpecial(password) ? 'text-green-600' : ''}>
                {hasSpecial(password) ? '✓' : '○'} One special character (!@#$%^&* etc.)
              </li>
            </ul>
          </div>
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            value={confirmPassword}
            onChange={onChange}
            placeholder="Confirm your password"
            required
          />
        </div>
        <Button
          type="submit"
          variant="primaryLift"
          fullWidth
          loading={isLoading}
          loadingLabel="Creating account..."
        >
          Create Account
        </Button>
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in here
            </a>
          </p>
        </div>
      </form>
    </>
  );
};

export default Register;
