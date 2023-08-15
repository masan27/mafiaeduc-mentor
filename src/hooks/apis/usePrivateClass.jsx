import { getAllPrivateClassApi } from '@/api/privateClassApi';
import { useQuery } from '@tanstack/react-query';

export default function usePrivateClass({ count, page, search }) {
    return useQuery(
        ['privateClass', page, count, search],
        () => getAllPrivateClassApi({ count, page, search }),
        {
            select: (data) => data?.data,
        }
    );
}
