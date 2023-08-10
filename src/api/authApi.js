import api from '@/libs/clientApi';

export const loginApi = async (data) => {
    try {
        const res = await api.post('auth/login', data);
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const logoutApi = async () => {
    try {
        const res = await api.post('auth/logout');
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const getProfileApi = async ({ token }) => {
    try {
        const res = await api.get('auth/profile', {
            headers: {
                'X-Mentor-Token': token,
            },
        });
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
