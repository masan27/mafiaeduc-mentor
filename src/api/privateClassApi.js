import api from '@/libs/clientApi';

export const createPrivateClassApi = async (data) => {
    try {
        const res = await api.post('private-classes/add', data);
        return res.data;
    } catch (e) {
        throw new Error(e.response.data.message);
    }
};

export const getAllPrivateClassApi = async ({ count, page, search }) => {
    try {
        const res = await api.get(
            `private-classes?page=${page}${count ? `&count=${count}` : ''}${
                search ? `&search=${search}` : ''
            }`
        );
        return res.data;
    } catch (e) {
        throw new Error(e.response.data.message);
    }
};

export const deletePrivateClassApi = async (classId) => {
    try {
        const res = await api.delete(`private-classes/${classId}`);
        return res.data;
    } catch (e) {
        throw new Error(e.response.data.message);
    }
};

export const getDetailPrivateClassApi = async (classId) => {
    try {
        const res = await api.get(`private-classes/${classId}`);
        return res.data;
    } catch (e) {
        throw new Error(e.response.data.message);
    }
};

export const updatePrivateClassApi = async (classId, data) => {
    try {
        const res = await api.patch(`private-classes/${classId}`, data);
        return res.data;
    } catch (e) {
        throw new Error(e.response.data.message);
    }
};
