import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_API_URL || '/api';

export const appointmentApi = createApi({
    reducerPath: 'appointmentApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().user?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => {
        return {
            getAppointments: builder.query({
                query: () => ({
                    url: '/appointments',
                }),
                providesTags: ['Appointment'],
            }),
            getAppointmentById: builder.query({
                query: (id) => ({
                    url: `/appointments/${id}`,
                }),
                providesTags: ['Appointment'],
            }),
            createAppointment: builder.mutation({
                query: (newAppointment) => ({
                    url: '/appointments',
                    method: 'POST',
                    body: newAppointment,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
                invalidatesTags: ['Appointment'],
            }),
            updateAppointment: builder.mutation({
                query: ({ id, ...data }) => ({
                    url: `/appointments/${id}`,
                    method: 'PUT',
                    body: data,
                }),
                invalidatesTags: ['Appointment'],
            }),
            deleteAppointment: builder.mutation({
                query: (id) => ({
                    url: `/appointments/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['Appointment'],
            }),
        };
    },
});

export const { useGetAppointmentsQuery, useGetAppointmentByIdQuery, useCreateAppointmentMutation, useUpdateAppointmentMutation, useDeleteAppointmentMutation } = appointmentApi;
