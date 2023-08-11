import { updateProfileApi } from '@/api/authApi';
import { useMutation } from '@tanstack/react-query';

export default function useUpdateProfile({ onSuccess, onError }) {
    return useMutation(updateProfileApi, {
        onSuccess: (res) => {
            onSuccess(res);
        },
        onError: (err) => {
            onError(err);
        },
    });
}
