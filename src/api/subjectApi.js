import api from '@/libs/clientApi';

export const getAllSubjectApi = async () => {
    try {
        const res = await api.get('subjects');
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
