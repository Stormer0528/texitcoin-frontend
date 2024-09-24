import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/useBoolean';

import { Iconify } from 'src/components/Iconify';
import { Form, Field } from 'src/components/Form';

import { useSignUp } from './useApollo';
import { useFetchPackages } from '../Sales/useApollo';

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod
  .object({
    firstName: zod.string({ required_error: 'First Name is required' }),
    lastName: zod.string({ required_error: 'Last Name is required' }),
    email: zod
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address is provided' }),
    mobile: zod.string({ required_error: 'Mobile is required' }),
    city: zod.string({ required_error: 'City is required' }),
    zipCode: zod.string({ required_error: 'ZIPCode is required' }),
    state: zod.string({ required_error: 'State is required' }),
    primaryAddress: zod.string({ required_error: 'Address is required' }),
    packageId: zod.string({ required_error: 'Package is required' }),
    secondaryAddress: zod.string({ required_error: 'Address Line 2 is required' }),
    password: zod
      .string()
      .min(1, { message: 'Password is required!' })
      .min(6, { message: 'Password must be at least 6 characters!' }),
    confirmPassword: zod.string().min(1, { message: 'Confirm password is required!' }),
    assetId: zod.string({ required_error: 'AssetID is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function SignUpView() {
  const [errorMsg, setErrorMsg] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const referralID = queryParams.get('reference');

  const router = useRouter();

  const password = useBoolean();

  const defaultValues = {
    firstName: '',
    lastName: '',
    username: '',
    mobile: '',
    sponsorUserId: '',
    email: '',
    packageId: '',
    assetId: '',
    password: '',
    paymentMethod: '',
    primaryAddress: '',
    secondaryAddress: '',
    state: '',
    zipCode: '',
    city: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { packages, fetchPackages } = useFetchPackages();
  const { submitSignUp } = useSignUp();

  const onSubmit = handleSubmit(async ({ confirmPassword, firstName, lastName, ...rest }) => {
    try {
      const { data } = await submitSignUp({
        variables: {
          data: {
            username: firstName.toLowerCase(),
            fullName: `${firstName} ${lastName}`,
            ...rest,
          },
        },
      });

      if (data) {
        const searchParams = new URLSearchParams({ email: rest.email }).toString();
        router.push(`${paths.verifyEmail}?${searchParams}`);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : error);
    }
  });

  useEffect(() => {
    fetchPackages({ variables: { filter: { status: true } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Fill out the form and let us blast off...</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Already have an account?
        </Typography>

        <Link component={RouterLink} href={paths.auth.signIn} variant="subtitle2">
          Sign in
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text name="firstName" label="First Name" InputLabelProps={{ shrink: true }} />
        <Field.Text name="lastName" label="Last Name" InputLabelProps={{ shrink: true }} />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text name="email" label="Email Address" InputLabelProps={{ shrink: true }} />
        <Field.Phone name="mobile" label="Phone" InputLabelProps={{ shrink: true }} />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text
          name="referralID"
          label="Reference"
          InputLabelProps={{ shrink: true }}
          value={referralID}
        />
        <Field.Text
          name="assetId"
          label="AssetID"
          placeholder="enter the 6-digit Coin ID"
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text name="primaryAddress" label="Address" InputLabelProps={{ shrink: true }} />
        <Field.Text name="secondaryAddress" label="Address 2" InputLabelProps={{ shrink: true }} />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text name="city" label="City" InputLabelProps={{ shrink: true }} />
        <Field.Text name="state" label="State" InputLabelProps={{ shrink: true }} />
        <Field.Text name="zipCode" label="Zip Code" InputLabelProps={{ shrink: true }} />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Select name="packageId" label="Pacakage">
          {packages.map((option) => (
            <MenuItem key={option?.id} value={option?.id}>
              {`$${option?.amount} @ ${option?.productName}`}
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Text
          name="paymentMethod"
          label="Payment Method"
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text
          name="password"
          label="Password"
          placeholder="6+ characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Field.Text
          name="confirmPassword"
          label="Confirm New Password"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Join Now..."
      >
        Join Now
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
