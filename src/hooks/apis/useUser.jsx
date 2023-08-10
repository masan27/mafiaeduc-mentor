import { getProfileApi } from '@/api/authApi';
import { logout } from '@/stores/reducers/authSlice';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function useUser({ token }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return useQuery(['user', token], () => getProfileApi({ token }), {
        refetchOnWindowFocus: false,
        retry: 0,
        enabled: !!token,
        cacheTime: 1000 * 60 * 60 * 24,
        select: (data) => data?.data,
        staleTime: 1000 * 60 * 60 * 24,
        onError: (err) => {
            if (err?.message === 'Unauthorized') {
                dispatch(logout());
                navigate('/login');
            }
        },
    });
}
