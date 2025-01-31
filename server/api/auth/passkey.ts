// https://www.perplexity.ai/search/passkey-nuxt-3-prisma-._AVqb7lTU2KN.oF7.lc3g

import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse
} from '@simplewebauthn/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const body = await readBody(event)
  const { action } = body

  if (action === 'register') {
    // Log out to ensure clean state
    await $fetch('/api/auth/logout', {
      method: 'post'
    })

    const options = await generateRegistrationOptions({
      rpName: runtimeConfig.WEBAUTHN_NAME,
      rpID: runtimeConfig.WEBAUTHN_RPID,
      userName: body.email
    })

    return options
  } else if (action === 'authenticate') {
    // Log out to ensure clean state
    await $fetch('/api/auth/logout', {
      method: 'post'
    })

    const options = await generateAuthenticationOptions({
      rpID: runtimeConfig.WEBAUTHN_RPID
    })

    return options
  } else if (action === 'verifyRegistration') {
    const verification = await verifyRegistrationResponse({
      response: body.response,
      expectedChallenge: body.challenge,
      expectedOrigin: runtimeConfig.WEBAUTHN_ORIGIN,
      expectedRPID: runtimeConfig.WEBAUTHN_RPID
    })

    if (verification.verified && verification.registrationInfo) {
      const user = await prisma.user.create({
        data: {
          username: body.username,
          email: body.email
        }
      })
      await prisma.authenticator.create({
        data: {
          credentialId: verification.registrationInfo.credential.id,
          userId: user.id,
          publicKey: Uint8Array.from(verification.registrationInfo.credential.publicKey),
          counter: verification.registrationInfo.credential.counter
        }
      })
    }

    return { verified: verification.verified }
  } else if (action === 'verifyAuthentication') {
    const authenticator = await prisma.authenticator.findUnique({
      where: { credentialId: body.response.id }
    })

    if (!authenticator) {
      throw new Error('Authenticator not found')
    }

    const verification = await verifyAuthenticationResponse({
      response: body.response,
      expectedChallenge: body.challenge,
      expectedOrigin: runtimeConfig.WEBAUTHN_ORIGIN,
      expectedRPID: runtimeConfig.WEBAUTHN_RPID,
      credential: {
        publicKey: authenticator.publicKey,
        id: authenticator.credentialId,
        counter: authenticator.counter
      }
    })

    if (verification.verified) {
      await prisma.authenticator.update({
        where: { id: authenticator.id },
        data: { counter: verification.authenticationInfo.newCounter }
      })

      const refreshToken = jwt.sign({
        userId: authenticator.userId
      }, runtimeConfig.JWT_SECRET, {
        expiresIn: '30d'
      })

      setCookie(event, 'refresh-token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30d
      })
    }

    return { verified: verification.verified }
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Invalid action'
  })
})