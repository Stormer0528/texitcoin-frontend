import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const LoginPage = lazy(() => import('src/pages/SignIn'));
const IntroPage = lazy(() => import('src/sections/Introduction'));
const CalculatorPage = lazy(() => import('src/pages/Calculator'));
const VerifyResult = lazy(() => import('src/sections/SignUp/Info'));
const VerifyEmail = lazy(() => import('src/sections/SignUp/verify'));
const ResetPasswordPage = lazy(() => import('src/pages/ResetPassword/resetPassword'));
const ForgotPasswordPage = lazy(() => import('src/pages/ResetPassword/forgotPassword'));

const signIn = {
  path: 'sign-in',
  element: (
    <GuestGuard>
      <AuthSplitLayout section={{ title: 'Hi, Welcome mineTXC' }}>
        <LoginPage />
      </AuthSplitLayout>
    </GuestGuard>
  ),
};

const signUp = {
  path: 'sign-up',
  element: (
    <GuestGuard>
      <IntroPage />
    </GuestGuard>
  ),
};

const forgotPassword = {
  path: 'forgot-password',
  element: (
    <GuestGuard>
      <AuthSplitLayout section={{ title: 'Hi, Welcome mineTXC' }}>
        <ForgotPasswordPage />
      </AuthSplitLayout>
    </GuestGuard>
  ),
};

const resetPassword = {
  path: 'reset-password',
  element: (
    <GuestGuard>
      <AuthSplitLayout section={{ title: 'Hi, Welcome mineTXC' }}>
        <ResetPasswordPage />
      </AuthSplitLayout>
    </GuestGuard>
  ),
};

const verifyEmail = {
  path: 'verify-email',
  element: (
    <GuestGuard>
      <AuthSplitLayout section={{ title: 'Hi, Welcome mineTXC' }}>
        <VerifyEmail />
      </AuthSplitLayout>
    </GuestGuard>
  ),
};

const verifyResult = {
  path: 'thanks',
  element: (
    <GuestGuard>
      <AuthSplitLayout section={{ title: 'Hi, Welcome mineTXC' }}>
        <VerifyResult />
      </AuthSplitLayout>
    </GuestGuard>
  ),
};

const calculator = {
  path: 'calculator',
  element: (
    <AuthSplitLayout section={{ title: 'Hi, Welcome mineTXC' }} width="720px">
      <CalculatorPage />
    </AuthSplitLayout>
  ),
};

export const authRoutes = [
  {
    path: '',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      signIn,
      signUp,
      verifyEmail,
      verifyResult,
      forgotPassword,
      resetPassword,
      calculator,
    ],
  },
];
