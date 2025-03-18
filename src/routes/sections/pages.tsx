import { lazy, Suspense } from 'react';
import { Outlet, Navigate, type RouteObject } from 'react-router';

import Container from '@mui/material/Container';

import { MainLayout } from 'src/layouts/main';
import { NavBasic } from 'src/layouts/main/navItem/nav-basic';

import { LoadingScreen } from 'src/components/loading-screen';

import { paths } from '../paths';

// ----------------------------------------------------------------------
const ContactPage = lazy(() => import('src/pages/Contact'));
const StatisticsPage = lazy(() => import('src/pages/Statistics'));
const IntroductionPage = lazy(() => import('src/pages/Introduction'));
const RapidRewardsPage = lazy(() => import('src/pages/RapidRewards'));
const SilverGuaranteePage = lazy(() => import('src/pages/SilverGuarantee'));
const RewardDetailPage = lazy(() => import('src/pages/MemberStatistics/List'));
const ResourcePage = lazy(() => import('src/pages/Resource/List'));
const ResourceDetailPage = lazy(() => import('src/pages/Resource/Detail'));
// ----------------------------------------------------------------------

export const statisticsRoutes: RouteObject[] = [
  {
    path: '',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Container>
          <NavBasic />
        </Container>
        <Outlet />
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to={paths.pages.intro.root} replace /> },
      { path: 'intro', element: <IntroductionPage /> },
      { path: 'rapid-rewards', element: <RapidRewardsPage /> },
      { path: 'silverbugs', element: <SilverGuaranteePage /> },
      { path: 'contact', element: <ContactPage /> },
      {
        path: 'resource',
        children: [
          { index: true, element: <ResourcePage /> },
          { path: ':slug', children: [{ index: true, element: <ResourceDetailPage /> }] },
        ],
      },
    ],
  },
  {
    path: 'statistics',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <MainLayout>
          <StatisticsPage />
        </MainLayout>
      </Suspense>
    ),
  },
  {
    path: 'reward/:id',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <MainLayout>
          <RewardDetailPage />
        </MainLayout>
      </Suspense>
    ),
  },
];
