import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../features/auth/LoginPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { DashboardOverviewPage } from '../features/dashboard/DashboardOverviewPage';
import { CoachVerificationPage } from '../features/coaches/CoachVerificationPage';
import { StoreManagementPage } from '../features/store/StoreManagementPage';
import { AddProductPage } from '../features/store/AddProductPage';
import { MealsListPage } from '../features/meals/MealsListPage';
import { AddMealPage } from '../features/meals/AddMealPage';
import { WorkoutsListPage } from '../features/workouts/WorkoutsListPage';
import { AddWorkoutPage } from '../features/workouts/AddWorkoutPage';
import { NotFoundPage } from '../features/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardOverviewPage /> },
      { path: 'coaches', element: <CoachVerificationPage /> },
      { path: 'store', element: <StoreManagementPage /> },
      { path: 'store/add', element: <AddProductPage /> },
      { path: 'meals', element: <MealsListPage /> },
      { path: 'meals/add', element: <AddMealPage /> },
      { path: 'workouts', element: <WorkoutsListPage /> },
      { path: 'workouts/add', element: <AddWorkoutPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
