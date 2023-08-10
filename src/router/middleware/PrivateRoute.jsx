import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute({ token, ...props }) {
    const location = useLocation();

    if (!token) {
        return <Navigate to={'/login'} replace state={{ from: location }} />;
    } else {
        return <Outlet {...props} />;
    }
}
