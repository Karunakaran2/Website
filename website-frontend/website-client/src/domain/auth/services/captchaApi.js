import { baseApi } from '@/shared/api/baseApi'
import { websiteRaw } from '@/shared/api/websiteApiBuilders'
import { CAPTCHA_ENDPOINTS } from '../constants/endpoints'

export const captchaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCaptcha: builder.query({
      async queryFn() {
        return websiteRaw(CAPTCHA_ENDPOINTS.getCaptcha)
      },
      keepUnusedDataFor: 0,
    }),
  }),
})

export const { useGetCaptchaQuery, useLazyGetCaptchaQuery } = captchaApi