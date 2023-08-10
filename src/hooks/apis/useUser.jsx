import { getProfileApi } from '@/api/authApi';
import { useQuery } from '@tanstack/react-query';

export default function useUser({ token }) {
    return useQuery(['user', token], () => getProfileApi({ token }), {
        refetchOnWindowFocus: false,
        retry: false,
        enabled: !!token,
        select: (data) => data?.data,
        staleTime: 1000 * 60 * 60 * 24,
    });
}
