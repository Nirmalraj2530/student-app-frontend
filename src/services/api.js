import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      // Depending on the route context, this could be tricky,
      // but let's try reading token based on which is available.
      // Assuming headers will be set correctly.
      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('token');
      const token = adminToken || userToken;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Dashboard', 'Skills', 'Users', 'Questions'],
  endpoints: (builder) => ({
    // ---- Dashboard Stats ----
    getDashboardStats: builder.query({
      query: () => '/api/admin/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getRecentActivity: builder.query({
      query: () => '/api/admin/dashboard/recent-activity',
      providesTags: ['Dashboard'],
    }),
    getPopularSkills: builder.query({
      query: () => '/api/admin/dashboard/popular-skills',
      providesTags: ['Dashboard'],
    }),

    // ---- Admin Skills ----
    getSkills: builder.query({
      query: () => '/api/admin/skills',
      providesTags: ['Skills'],
    }),
    createSkill: builder.mutation({
      query: (body) => ({
        url: '/api/admin/skills',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Skills', 'Dashboard'],
    }),
    updateSkill: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/admin/skills/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Skills', 'Dashboard'],
    }),
    deleteSkill: builder.mutation({
      query: (id) => ({
        url: `/api/admin/skills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skills', 'Dashboard'],
    }),

    // ---- Admin Users ----
    getUsers: builder.query({
      query: () => '/api/admin/users',
      providesTags: ['Users'],
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: '/api/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users', 'Dashboard'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/admin/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Users', 'Dashboard'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Dashboard'],
    }),

    // ---- User Skill ----
    getSkillsUser: builder.query({
      query: () => '/api/skills',
      providesTags: ['Skills'],
    }),
    getSkillByKey: builder.query({
      query: (skillKey) => `/api/skills/${skillKey}`,
      providesTags: ['Skills'],
    }),

    // ---- Auth ----
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/api/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    // ---- Questions ----
    getQuestions: builder.query({
      query: (skill) => `/api/admin/questions${skill ? `?skill=${skill}` : ''}`,
      providesTags: ['Questions'],
    }),
    createQuestion: builder.mutation({
      query: (data) => ({
        url: '/api/admin/questions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Questions', 'Dashboard', 'Skills'],
    }),
    updateQuestion: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/admin/questions/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Questions', 'Dashboard', 'Skills'],
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/api/admin/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Questions', 'Dashboard', 'Skills'],
    }),

    // ---- Test Results ----
    submitTest: builder.mutation({
      query: (data) => ({
        url: '/api/test-results/submit',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users', 'Dashboard'],
    }),
    getTestResult: builder.query({
      query: (resultId) => `/api/test-results/${resultId}`,
    }),
    getTestReview: builder.query({
      query: (resultId) => `/api/test-results/${resultId}/review`,
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  useGetPopularSkillsQuery,
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetSkillsUserQuery,
  useGetSkillByKeyQuery,
  useLoginMutation,
  useAdminLoginMutation,
  useRegisterUserMutation,
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useSubmitTestMutation,
  useGetTestResultQuery,
  useGetTestReviewQuery,
} = api;
