import { getRecentSchedulesApi } from '@/api/schedulesApi';
import { useQuery } from '@tanstack/react-query';

export default function useRecentSchedules({ user }) {
    return useQuery(['recentSchedules', user], getRecentSchedulesApi, {
        enabled: !!user,
        select: (data) => data.data,
    });
}
