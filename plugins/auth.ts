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
  async setup () {
    const isAuthenticated = useState('isAuthenticated', () => false)

    const { data: user, refresh: refreshUser } = await useFetch<User>('/api/auth/user')

    if (user.value) {
      isAuthenticated.value = true
    }

    const login = async () => {
      const {
        $auth: {
          isAuthenticated,
          refreshUser
        }
      } = useNuxtApp()

      const options = await $fetch<PublicKeyCredentialRequestOptionsJSON>('/api/auth/passkey', {
        method: 'POST',
        body: { action: 'authenticate' },
      })
  
      const response = await startAuthentication(options)
  
      const verification = await $fetch<{ verified: boolean }>('/api/auth/passkey', {
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
      const options = await $fetch<PublicKeyCredentialCreationOptionsJSON>('/api/auth/passkey', {
        method: 'POST',
        body: { action: 'register', email }
      })
  
      const response = await startRegistration(options)
  
      const verification = await $fetch<{ verified: boolean }>('/api/auth/passkey', {
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
      await $fetch('/api/auth/logout', {
        method: 'post'
      })
      isAuthenticated.value = false
      user.value = null
      await navigateTo('/login')
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