import ScreenLoading from '@/components/handlers/ScreenLoading';
import useUser from '@/hooks/apis/useUser';
import Router from '@/router/Router';
import { getToken, setToken, setUser } from '@/stores/reducers/authSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

export default function App() {
    const dispatch = useDispatch();
    const token = useSelector(getToken);
    const { data, isLoading } = useUser({ token });

    useEffect(() => {
        if (data) {
            dispatch(setUser(data));
        }
    }, [data, dispatch]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(setToken(token));
        }
    }, [dispatch]);

    return (
        <>
            <ToastContainer
                position='bottom-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
            />

            {!!token && isLoading ? <ScreenLoading /> : <Router />}
        </>
    );
}
