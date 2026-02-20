import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../utils/toast';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../../features/auth/authSlice';
import { validatePasswordForLogin } from '../../utils/passwordValidation';
import type { RootState, AppDispatch } from '../../app/store';
import AuthCardHeader from './AuthCardHeader';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
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
    const pwdCheck = validatePasswordForLogin(password);
    if (!pwdCheck.valid) {
      toast.error(pwdCheck.message);
      return;
    }
    dispatch(login({ email, password }));
  };

  return (
    <>
      <AuthCardHeader
        title="Sign In"
        subtitle="Sign in to continue to your Todo App"
      />
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          <Input
            type="email"
            name="email"
            label="Email address"
            value={email}
            onChange={onChange}
            placeholder="you@example.com"
            required
          />
          <Input
            type="password"
            name="password"
            label="Password"
            value={password}
            onChange={onChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <Button
          type="submit"
          variant="primaryLift"
          fullWidth
          loading={isLoading}
          loadingLabel="Signing in..."
        >
          Sign in
        </Button>
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Create one now
            </a>
          </p>
        </div>
      </form>
    </>
  );
};

export default Login;
