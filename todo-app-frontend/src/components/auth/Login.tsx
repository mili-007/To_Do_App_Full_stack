import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import type { LoginFormValues } from '../../types';
import { validatePasswordForLogin } from '../../utils/passwordValidation';
import AuthCardHeader from './AuthCardHeader';
import Button from '../ui/Button';
import Input from '../ui/Input';

const defaultValues: LoginFormValues = {
  email: '',
  password: ''
};

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({ defaultValues });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isError && message) toast.error(message);
    if (isSuccess || user) navigate('/dashboard');
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data: LoginFormValues) => {
    const pwdCheck = validatePasswordForLogin(data.password);
    if (!pwdCheck.valid) {
      toast.error(pwdCheck.message);
      return;
    }
    dispatch(login({ email: data.email, password: data.password }));
  };

  return (
    <>
      <AuthCardHeader
        title="Sign In"
        subtitle="Sign in to continue to your Todo App"
      />
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                label="Email address"
                placeholder="you@example.com"
                required
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                label="Password"
                placeholder="Enter your password"
                required
                error={errors.password?.message}
              />
            )}
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
