import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, reset } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import type { RegisterFormValues } from '../../types';
import { validatePasswordStrength, PASSWORD_RULE_CHECKS } from '../../utils/passwordValidation';
import AuthCardHeader from './AuthCardHeader';
import Button from '../ui/Button';
import Input from '../ui/Input';

const defaultValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};

const Register = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormValues>({ defaultValues });

  const password = watch('password');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isError && message) toast.error(message);
    if (isSuccess || user) navigate('/dashboard');
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data: RegisterFormValues) => {
    const pwdValidation = validatePasswordStrength(data.password);
    if (!pwdValidation.valid) {
      toast.error(`Password must be strong: ${pwdValidation.message}`);
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    dispatch(registerUser({ name: data.name, email: data.email, password: data.password }));
  };

  return (
    <>
      <AuthCardHeader
        title="Create Account"
        subtitle="Join us and start organizing your tasks"
      />
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Full name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Full Name"
                placeholder="John Doe"
                required
                error={errors.name?.message}
              />
            )}
          />
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
          <div>
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  label="Password"
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                  error={errors.password?.message}
                />
              )}
            />
            <p className="text-xs text-gray-500 mt-1.5 mb-1">Strong password requirements:</p>
            <ul className="text-xs text-gray-600 space-y-0.5 list-none">
              {PASSWORD_RULE_CHECKS?.map(({ label, test }) => (
                <li key={label} className={test(password) ? 'text-green-600' : ''}>
                  {test(password) ? '✓' : '○'} {label}
                </li>
              ))}
            </ul>
          </div>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: 'Please confirm your password' }}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                error={errors.confirmPassword?.message}
              />
            )}
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
