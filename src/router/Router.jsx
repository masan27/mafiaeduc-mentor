import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import useUser from '@/hooks/apis/useUser';
import { getToken } from '@/stores/reducers/authSlice';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import LoginPage from '@/pages/login/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import PrivateRoute from './middleware/PrivateRoute';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function Router() {
    const token = useSelector(getToken);
    const { data, isLoading } = useUser({ token });

    return (
        <Routes>
            <Route path='/' element={<Navigate to={'/dashboard'} />} />

            <Route element={<AuthLayout />}>
                <Route path='login' element={<LoginPage />} />
            </Route>

            <Route element={<PrivateRoute isLoading={isLoading} user={data} />}>
                <Route element={<DashboardLayout />}>
                    <Route path='/dashboard' element={<DashboardPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
