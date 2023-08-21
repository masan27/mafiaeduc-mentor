import api from '@/libs/clientApi';

export const getAllPaymentMethods = async ({ search }) => {
    try {
        const res = await api.get(
            `/mentor-payment-methods${search ? `?search=${search}` : ''}`
        );
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const getGlobalPaymentMethods = async () => {
    try {
        const res = await api.get('/payment-methods');
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const addPaymentMethods = async (data) => {
    try {
        const res = await api.post('/mentor-payment-methods', data);
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const deletePaymentMethods = async (paymentMethodId) => {
    try {
        const res = await api.delete(
            `/mentor-payment-methods/${paymentMethodId}`
        );
        return res.data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};
