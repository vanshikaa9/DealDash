import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';

const isDevelopment = import.meta.env.MODE === 'development';
const NotFoundPage = isDevelopment
  ? lazy(() => import('../dev-tools/src/PageNotFound'))
  : lazy(() => import('./pages/_404'));

const CouponDetailPage = lazy(() => import('./pages/coupon/[id]'));
const ExpiringPage = lazy(() => import('./pages/expiring'));
const AdminPage = lazy(() => import('./pages/admin'));
const AboutPage = lazy(() => import('./pages/about'));
const ContactPage = lazy(() => import('./pages/contact'));
const FavouritesPage = lazy(() => import('./pages/favourites'));

export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/coupon/:id', element: <CouponDetailPage /> },
  { path: '/expiring', element: <ExpiringPage /> },
  { path: '/admin', element: <AdminPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/favourites', element: <FavouritesPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export type Path = '/' | '/expiring' | '/admin' | '/about' | '/contact' | '/favourites';
export type Params = Record<string, string | undefined>;
