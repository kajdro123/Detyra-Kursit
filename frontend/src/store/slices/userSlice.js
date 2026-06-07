import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';
import { taskApi } from '../apis/taskApi';
import { patientApi } from '../apis/patientApi';
import { appointmentApi } from '../apis/appointmentApi';
import { treatmentApi } from '../apis/treatmentApi';

const localUser = JSON.parse(localStorage.getItem('user'));

const userSlice = createSlice({
    name: 'user',
    initialState: localUser ? localUser : null,
    reducers: {
        setUser(state, action) {
            return action.payload;
        },
        logoutUser() {
            localStorage.removeItem('user');
            return null;
        }
    }
});

export const { setUser, logoutUser } = userSlice.actions;

// Thunk to logout and reset all RTK Query caches so subsequent logins fetch fresh data
export const logoutAndReset = () => (dispatch) => {
    dispatch(logoutUser());
    // Reset caches for all API slices
    dispatch(userApi.util.resetApiState());
    dispatch(taskApi.util.resetApiState());
    dispatch(patientApi.util.resetApiState());
    dispatch(appointmentApi.util.resetApiState());
    dispatch(treatmentApi.util.resetApiState());
};
export default userSlice.reducer;
