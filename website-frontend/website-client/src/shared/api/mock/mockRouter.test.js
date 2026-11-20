import { describe, expect, it } from 'vitest'
import { handleMockRequest } from './mockRouter'

describe('website mock router', () => {
  it('generates mock captcha', async () => {
    const res = await handleMockRequest('/api/v1/captcha/getCaptcha')
    expect(res.status).toBe(200)
    expect(res.data.captchaId).toBeDefined()
    expect(res.data.imageBase64).toBeDefined()
    expect(res.data.code).toBeUndefined()
  })

  it('lists public news envelope', async () => {
    const res = await handleMockRequest('/api/v1/content/news')
    expect(res.status).toBe(200)
    expect(res.data.success).toBe(true)
    expect(Array.isArray(res.data.data)).toBe(true)
  })

  it('rejects login without captcha', async () => {
    const res = await handleMockRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'u', password: 'p' }),
    })
    expect(res.status).toBe(400)
  })
})