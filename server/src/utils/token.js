import jwt from 'jsonwebtoken'
import { env } from '../config/env.js' // use your existing env loader

export function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, roles: user.roles },
    env.jwtAccess,
    { expiresIn: '30m' }
  )
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    env.jwtRefresh,
    { expiresIn: '7d' }
  )
}

export const issueAccessToken = generateAccessToken
export const issueRefreshToken = generateRefreshToken
