import { logoutApi } from '@/api/authApi';
import { useMutation } from '@tanstack/react-query';

export default function useLogout({ onSuccess, onError }) {
    return useMutation(logoutApi, {
        onSuccess: (res) => {
            onSuccess(res);
        },
        onError: (err) => {
            onError(err);
        },
    });
}
