import { configureStore } from '@reduxjs/toolkit';

// Import the user reducer
import userReducer from './slices/userSlice';

// Import the API slices
import { userApi } from './apis/userApi';
import { taskApi } from './apis/taskApi';
import { patientApi } from './apis/patientApi';
import { appointmentApi } from './apis/appointmentApi';
import { treatmentApi } from './apis/treatmentApi';

export const store = configureStore({
    reducer: {
        user: userReducer,
        [userApi.reducerPath]: userApi.reducer,
        [taskApi.reducerPath]: taskApi.reducer,
        [patientApi.reducerPath]: patientApi.reducer,
        [appointmentApi.reducerPath]: appointmentApi.reducer,
        [treatmentApi.reducerPath]: treatmentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApi.middleware,
            taskApi.middleware,
            patientApi.middleware,
            appointmentApi.middleware,
            treatmentApi.middleware
        ),
});