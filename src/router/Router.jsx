import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import useUser from '@/hooks/apis/useUser';
import { getToken } from '@/stores/reducers/authSlice';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import LoginPage from '@/pages/login/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import PrivateRoute from './middleware/PrivateRoute';

export default function Router() {
    const token = useSelector(getToken);
    const { data, isLoading } = useUser({ token });

    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path='login' element={<LoginPage />} />
            </Route>

            <Route element={<PrivateRoute isLoading={isLoading} user={data} />}>
                <Route path='/dashboard' element={<DashboardPage />} />
            </Route>
        </Routes>
    );
}
