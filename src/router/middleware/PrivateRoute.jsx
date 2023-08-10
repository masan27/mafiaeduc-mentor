import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute({ isLoading, user, ...props }) {
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to={'/login'} replace state={{ from: location }} />;
    } else {
        if (!isLoading && !user) {
            return (
                <Navigate to={'/login'} replace state={{ from: location }} />
            );
        } else {
            return <Outlet {...props} />;
        }
    }
}
