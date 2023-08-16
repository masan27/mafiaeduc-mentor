import { getRecentSchedulesApi } from '@/api/schedulesApi';
import { useQuery } from '@tanstack/react-query';

export default function useRecentSchedules({ user, count, page }) {
    return useQuery(
        ['recentSchedules', user, page, count],
        () =>
            getRecentSchedulesApi({
                page,
                count,
            }),
        {
            enabled: !!user && !!count && !!page,
            select: (data) => data.data,
        }
    );
}
