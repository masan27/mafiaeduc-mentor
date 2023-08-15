import { getAllStats } from '@/api/statsApi';
import { getUser } from '@/stores/reducers/authSlice';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

export default function useStats() {
    const user = useSelector(getUser);

    return useQuery(['stats', user], getAllStats, {
        staleTime: 1000 * 60 * 5,
        enabled: !!user,
        select: (data) => data.data,
    });
}
