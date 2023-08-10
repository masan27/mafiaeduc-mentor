import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute({ isLoading, user, ...props }) {
    const location = useLocation();

    if (!isLoading && !!user) {
        return <Outlet {...props} />;
    } else {
        return (
            <Navigate
                to={'/login'}
                replace
                state={{ from: location.pathname }}
            />
        );
    }
}
