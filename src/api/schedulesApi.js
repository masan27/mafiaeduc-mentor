import api from '@/libs/clientApi';

export const getRecentSchedulesApi = async ({ page, count }) => {
    try {
        const res = await api.get(
            `schedules/recent?page=${page}${count ? `&count=${count}` : ''}`
        );
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
