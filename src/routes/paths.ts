// ----------------------------------------------------------------------

const ROOTS = {
  // Auth
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFYRESULT: '/thanks',

  // Statistics
  INTRO: '/intro',

  // Dashboard
  DASHBOARD: '/dashboard',
  SALES: '/sales',
  REWARD: '/reward',
  SPONSOR: '/sponsor',
  PLACEMENT: '/placement',
  COMMISSION: '/commission',
  RESOURCE: '/resource',
  CALCULATOR: '/calculator',
  PROFILE: '/profile',
  TEAM: '/team',
  MAIL: '/mail',
  NOTIFICATIONS: '/notifications',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    signIn: ROOTS.SIGN_IN,
    signUp: ROOTS.SIGN_UP,
  },

  // FORGOT PASSWORD
  forgotPassword: ROOTS.FORGOT_PASSWORD,

  // RESET PASSWORD
  resetPassword: ROOTS.RESET_PASSWORD,

  // VERIFY EMAIL
  verifyEmail: ROOTS.VERIFY_EMAIL,

  // RESULT
  verifyResult: ROOTS.VERIFYRESULT,

  // INTRO
  intro: { root: ROOTS.INTRO },

  // CALCULATOR
  calculator: { root: ROOTS.CALCULATOR },

  // DASHBOARD
  dashboard: {
    root: '/',
    history: {
      root: ROOTS.DASHBOARD,
    },
    sales: {
      root: ROOTS.SALES,
      edit: (id: string) => `${ROOTS.SALES}/${id}`,
      new: `${ROOTS.SALES}/new`,
    },
    reward: {
      root: ROOTS.REWARD,
      new: `${ROOTS.REWARD}/new`,
      edit: (id: string) => `${ROOTS.REWARD}/new/${id}`,
      detail: (id: string) => `${ROOTS.REWARD}/${id}`,
      view: (id: string) => `${ROOTS.REWARD}/statistics/${id}`,
    },
    sponsor: { root: ROOTS.SPONSOR },
    placement: { root: ROOTS.PLACEMENT },
    commission: { root: ROOTS.COMMISSION },
    resource: { root: ROOTS.RESOURCE, view: (slug: string) => `${ROOTS.RESOURCE}/${slug}` },
    profile: {
      root: ROOTS.PROFILE,
    },
    notifications: {
      root: ROOTS.NOTIFICATIONS,
    },
    team: {
      root: ROOTS.TEAM,
    },
    mail: {
      root: ROOTS.MAIL,
    },
  },
  notFound: '/404',
};
