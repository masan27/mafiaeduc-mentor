import { changePhotoApi } from '@/api/authApi';
import { useMutation } from '@tanstack/react-query';

export default function useChangePhoto({ onSuccess, onError }) {
    return useMutation(changePhotoApi, {
        onSuccess: (res) => {
            onSuccess(res);
        },
        onError: (err) => {
            onError(err);
        },
    });
}
