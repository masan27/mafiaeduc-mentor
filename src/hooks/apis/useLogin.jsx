import { loginApi } from '@/api/authApi';
import { useMutation } from '@tanstack/react-query';

export default function useLogin({ onSuccess, onError }) {
    return useMutation((data) => loginApi(data), {
        onSuccess: (data) => {
            onSuccess(data);
        },
        onError: (error) => {
            onError(error);
        },
    });
}
