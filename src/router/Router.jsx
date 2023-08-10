import { Route, Routes } from 'react-router-dom';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import LoginPage from '@/pages/login/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';

export default function Router() {
    return (
        <Routes>
            <Route path='/dashboard' element={<DashboardPage />} />

            <Route path='/' element={<AuthLayout />}>
                <Route path='login' element={<LoginPage />} />
            </Route>
        </Routes>
    );
}
