import api from '@/libs/clientApi';

export const getPrivateClassScheduleApi = async ({ classId }) => {
    try {
        const res = await api.get(`schedules/${classId}`);
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const addPrivateClassScheduleApi = async ({ classId, data }) => {
    try {
        const res = await api.post(`schedules/${classId}/add`, data);
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const editPrivateClassScheduleApi = async ({ scheduleId, data }) => {
    try {
        const res = await api.patch(`schedules/${scheduleId}`, data);
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const deletePrivateClassScheduleApi = async (scheduleId) => {
    try {
        const res = await api.delete(`schedules/${scheduleId}`);
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const donePrivateClassScheduleApi = async (scheduleId) => {
    try {
        const res = await api.post(`schedules/done/${scheduleId}`);
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
