import { getAllSubjectApi } from '@/api/subjectApi';
import { useQuery } from '@tanstack/react-query';

export default function useSubject({ onSuccess, onError }) {
    return useQuery(['subject'], getAllSubjectApi, {
        refetchOnWindowFocus: false,
        select: (data) => data.data,
        onSuccess: onSuccess,
        onError: onError,
    });
}
