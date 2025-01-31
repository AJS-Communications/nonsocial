import {
  startAuthentication,
  startRegistration
} from '@simplewebauthn/browser'

import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON
} from '@simplewebauthn/types'

export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['api'],
  async setup () {
    const { $api } = useNuxtApp()

    const token = useCookie('token')

    const user = useState<User | null>('user')

    const isAuthenticated = useState('isAuthenticated', () => false)

    const refreshUser = async () => {
      if (!token.value) {
        user.value = null
        isAuthenticated.value = false
      } else {
        try {
          const data = await $api<User>('/api/auth/user')
          user.value = data
          if (user.value) {
            isAuthenticated.value = true
          }
        } catch (e) {
          user.value = null
          isAuthenticated.value = false
        }
      }
    }

    const login = async () => {
      const options = await $api<PublicKeyCredentialRequestOptionsJSON>('/api/auth/passkey', {
        method: 'POST',
        body: { action: 'authenticate' },
      })
  
      const response = await startAuthentication({ optionsJSON: options })
  
      const verification = await $api<{ verified: boolean }>('/api/auth/passkey', {
        method: 'POST',
        body: {
          action: 'verifyAuthentication',
          response,
          challenge: options.challenge
        }
      })
  
      if (verification.verified) {
        isAuthenticated.value = true
        await refreshUser()
      }

      return verification.verified
    }

    const register = async (username: string, email: string) => {
      const options = await $api<PublicKeyCredentialCreationOptionsJSON>('/api/auth/passkey', {
        method: 'POST',
        body: { action: 'register', email }
      })
  
      const response = await startRegistration({ optionsJSON: options })
  
      const verification = await $api<{ verified: boolean }>('/api/auth/passkey', {
        method: 'POST',
        body: {
          action: 'verifyRegistration',
          response,
          challenge: options.challenge,
          username,
          email
        }
      })
  
      return verification.verified
    }

    const logout = async () => {
      await $api('/api/auth/logout', { method: 'post' })
      token.value = null
      isAuthenticated.value = false
      user.value = null
      await navigateTo('/login', { external: true })
    }

    return {
      provide: {
        auth: {
          isAuthenticated,
          user,
          refreshUser,
          login,
          register,
          logout
        }
      }
    }
  }
})