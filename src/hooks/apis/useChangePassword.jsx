import { changePasswordApi } from '@/api/authApi';
import { useMutation } from '@tanstack/react-query';

export default function useChangePassword({ onSuccess, onError }) {
    return useMutation(changePasswordApi, {
        onSuccess: (res) => {
            onSuccess(res);
        },
        onError: (err) => {
            onError(err);
        },
    });
}
