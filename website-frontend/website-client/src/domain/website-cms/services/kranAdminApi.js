import { baseApi } from '@/shared/api/baseApi'
import { requestJson } from '@/shared/api/client'
import { websiteGet, websiteMutate } from '@/shared/api/websiteApiBuilders'

function adminCrud(builder, name, basePath, tag) {
  const byId = (id) => `${basePath}/${encodeURIComponent(id)}`
  const tags = [{ type: tag, id: 'LIST' }]
  return {
    [`getAdmin${name}`]: builder.query({
      async queryFn() {
        return websiteGet(basePath)
      },
      providesTags: tags,
    }),
    [`createAdmin${name}`]: builder.mutation({
      async queryFn(body) {
        return websiteMutate(basePath, 'POST', body)
      },
      invalidatesTags: tags,
    }),
    [`updateAdmin${name}`]: builder.mutation({
      async queryFn({ id, ...body }) {
        return websiteMutate(byId(id), 'PUT', body)
      },
      invalidatesTags: tags,
    }),
    [`deleteAdmin${name}`]: builder.mutation({
      async queryFn(id) {
        const result = await requestJson(byId(id), { method: 'DELETE' })
        if (result.error) {
          return result
        }
        return { data: { id } }
      },
      invalidatesTags: tags,
    }),
  }
}

export const kranAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...adminCrud(builder, 'Categories', '/api/v1/admin/categories', 'CmsCategory'),
    ...adminCrud(builder, 'Products', '/api/v1/admin/products', 'CmsProduct'),
    ...adminCrud(builder, 'Solutions', '/api/v1/admin/solutions', 'CmsSolution'),
    ...adminCrud(builder, 'Projects', '/api/v1/admin/projects', 'CmsProject'),
    ...adminCrud(builder, 'CaseStudies', '/api/v1/admin/case-studies', 'CmsCaseStudy'),
    ...adminCrud(builder, 'KranSeniors', '/api/v1/admin/kran-seniors', 'CmsKranSenior'),
    ...adminCrud(builder, 'KranFaces', '/api/v1/admin/kran-faces', 'CmsKranFace'),
    ...adminCrud(builder, 'DataSheets', '/api/v1/admin/data-sheets', 'CmsDataSheet'),
    ...adminCrud(builder, 'Timeline', '/api/v1/admin/timeline', 'CmsTimeline'),
    ...adminCrud(builder, 'GalleryItems', '/api/v1/admin/gallery-items', 'CmsGalleryItem'),
    ...adminCrud(builder, 'GalleryGroups', '/api/v1/admin/gallery-groups', 'CmsGalleryGroup'),
    ...adminCrud(builder, 'Careers', '/api/v1/admin/careers', 'CmsCareer'),
    ...adminCrud(builder, 'MailSetup', '/api/v1/admin/mail-setup', 'CmsMailSetup'),
    getAdminJobApplications: builder.query({
      async queryFn() {
        return websiteGet('/api/v1/admin/job-applications')
      },
      providesTags: [{ type: 'CmsCareer', id: 'applications' }],
    }),
    getAdminSubmittedResumes: builder.query({
      async queryFn() {
        return websiteGet('/api/v1/admin/submitted-resumes')
      },
      providesTags: [{ type: 'CmsCareer', id: 'resumes' }],
    }),
  }),
})

export const {
  useGetAdminJobApplicationsQuery,
  useGetAdminSubmittedResumesQuery,
} = kranAdminApi

export const CMS_ADMIN_HOOKS_BY_PRIMARY = {
  'website-category-setup': {
    useList: kranAdminApi.useGetAdminCategoriesQuery,
    useCreate: kranAdminApi.useCreateAdminCategoriesMutation,
    useUpdate: kranAdminApi.useUpdateAdminCategoriesMutation,
    useDelete: kranAdminApi.useDeleteAdminCategoriesMutation,
  },
  'website-products': {
    useList: kranAdminApi.useGetAdminProductsQuery,
    useCreate: kranAdminApi.useCreateAdminProductsMutation,
    useUpdate: kranAdminApi.useUpdateAdminProductsMutation,
    useDelete: kranAdminApi.useDeleteAdminProductsMutation,
  },
  'website-solutions': {
    useList: kranAdminApi.useGetAdminSolutionsQuery,
    useCreate: kranAdminApi.useCreateAdminSolutionsMutation,
    useUpdate: kranAdminApi.useUpdateAdminSolutionsMutation,
    useDelete: kranAdminApi.useDeleteAdminSolutionsMutation,
  },
  'website-projects': {
    useList: kranAdminApi.useGetAdminProjectsQuery,
    useCreate: kranAdminApi.useCreateAdminProjectsMutation,
    useUpdate: kranAdminApi.useUpdateAdminProjectsMutation,
    useDelete: kranAdminApi.useDeleteAdminProjectsMutation,
  },
  'website-case-study': {
    useList: kranAdminApi.useGetAdminCaseStudiesQuery,
    useCreate: kranAdminApi.useCreateAdminCaseStudiesMutation,
    useUpdate: kranAdminApi.useUpdateAdminCaseStudiesMutation,
    useDelete: kranAdminApi.useDeleteAdminCaseStudiesMutation,
  },
  'website-kran-seniors': {
    useList: kranAdminApi.useGetAdminKranSeniorsQuery,
    useCreate: kranAdminApi.useCreateAdminKranSeniorsMutation,
    useUpdate: kranAdminApi.useUpdateAdminKranSeniorsMutation,
    useDelete: kranAdminApi.useDeleteAdminKranSeniorsMutation,
  },
  'website-kran-faces': {
    useList: kranAdminApi.useGetAdminKranFacesQuery,
    useCreate: kranAdminApi.useCreateAdminKranFacesMutation,
    useUpdate: kranAdminApi.useUpdateAdminKranFacesMutation,
    useDelete: kranAdminApi.useDeleteAdminKranFacesMutation,
  },
  'website-data-sheets': {
    useList: kranAdminApi.useGetAdminDataSheetsQuery,
    useCreate: kranAdminApi.useCreateAdminDataSheetsMutation,
    useUpdate: kranAdminApi.useUpdateAdminDataSheetsMutation,
    useDelete: kranAdminApi.useDeleteAdminDataSheetsMutation,
  },
  'website-timeline': {
    useList: kranAdminApi.useGetAdminTimelineQuery,
    useCreate: kranAdminApi.useCreateAdminTimelineMutation,
    useUpdate: kranAdminApi.useUpdateAdminTimelineMutation,
    useDelete: kranAdminApi.useDeleteAdminTimelineMutation,
  },
  'website-gallery': {
    useList: kranAdminApi.useGetAdminGalleryItemsQuery,
    useCreate: kranAdminApi.useCreateAdminGalleryItemsMutation,
    useUpdate: kranAdminApi.useUpdateAdminGalleryItemsMutation,
    useDelete: kranAdminApi.useDeleteAdminGalleryItemsMutation,
  },
  'website-careers': {
    useList: kranAdminApi.useGetAdminCareersQuery,
    useCreate: kranAdminApi.useCreateAdminCareersMutation,
    useUpdate: kranAdminApi.useUpdateAdminCareersMutation,
    useDelete: kranAdminApi.useDeleteAdminCareersMutation,
  },
  'website-mail-setup': {
    useList: kranAdminApi.useGetAdminMailSetupQuery,
    useCreate: kranAdminApi.useCreateAdminMailSetupMutation,
    useUpdate: kranAdminApi.useUpdateAdminMailSetupMutation,
    useDelete: kranAdminApi.useDeleteAdminMailSetupMutation,
  },
}