import api from '@/libs/clientApi';

export const getRecentSchedulesApi = async () => {
    try {
        const res = await api.get('schedules/recent');
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
