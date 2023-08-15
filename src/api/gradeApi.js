import api from '@/libs/clientApi';

export const getAllGradeApi = async () => {
    try {
        const res = await api.get('grades');
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
