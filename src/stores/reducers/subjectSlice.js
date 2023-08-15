import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    subjects: [],
};

const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        setSubjects: (state, { payload }) => {
            state.subjects = payload;
        },
    },
});

export const getSubjects = (state) => state.subject.subjects;

export const { setSubjects } = subjectSlice.actions;

export default subjectSlice.reducer;
