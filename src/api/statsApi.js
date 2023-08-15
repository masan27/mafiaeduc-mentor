import api from '@/libs/clientApi';

export const getAllStats = async () => {
    try {
        const res = await api.get('stats');
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
