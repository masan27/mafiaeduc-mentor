import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    grades: [],
};

const gradeSlice = createSlice({
    name: 'grade',
    initialState,
    reducers: {
        setGrades: (state, { payload }) => {
            state.grades = payload;
        },
    },
});

export const getGrades = (state) => state.grade.grades;

export const { setGrades } = gradeSlice.actions;

export default gradeSlice.reducer;
