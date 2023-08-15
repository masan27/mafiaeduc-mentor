import { getAllGradeApi } from '@/api/gradeApi';
import { useQuery } from '@tanstack/react-query';

export default function useGrade({ onSuccess, onError }) {
    return useQuery(['grade'], getAllGradeApi, {
        refetchOnWindowFocus: false,
        select: (data) => data.data,
        onSuccess: onSuccess,
        onError: onError,
    });
}
