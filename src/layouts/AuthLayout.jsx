import { Outlet } from 'react-router-dom';

export default function AuthLayout({ className = '', ...rest }) {
    return (
        <main className={`flexCenter h-screen ${className}`} {...rest}>
            <Outlet />
        </main>
    );
}
