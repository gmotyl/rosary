import {createContext, useState, useEffect, FC, PropsWithChildren} from 'react'
import {decodeJWT, isUserAuthenticated} from '../tools/auth'
import {storage} from '../tools/storage'

export interface AuthContext {
  isAuthenticated: boolean
  authToken: string
  payload: AuthPayload
  setAuthToken: (authToken: string) => void
  logout: () => void
  hasRole: (role: EAuthRoles) => boolean
  children?: React.ReactNode
}

export interface AuthPayload {
  exp: number
  id: string
  username: string
  roles: EAuthRoles[]
}

export enum EAuthRoles {
  ROLE_UNAUTHORIZED = 'ROLE_UNAUTHORIZED',
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
}

const methodNotImplementedWarning = () =>
  console.error(
    'You attempt to use AuthContext but forgot to wrap component in AuthProvider!',
  )

export const defaultValue = {
  isAuthenticated: false,
  authToken: '',
  payload: {
    exp: 0,
    id: '',
    username: '',
    roles: [EAuthRoles.ROLE_UNAUTHORIZED],
  },
  setAuthToken: (authToken: string) => methodNotImplementedWarning,
  logout: () => methodNotImplementedWarning,
  hasRole: (role: EAuthRoles) => {
    methodNotImplementedWarning()
    return false
  },
}

export const AuthContext = createContext<AuthContext>(defaultValue)

const AuthProvider: FC<PropsWithChildren<{}>> = ({children}) => {
  const savedPayload = storage.getItem('payload')
  const initialPayload = savedPayload
    ? JSON.parse(savedPayload)
    : defaultValue.payload
  const [authToken, setAuthToken] = useState(getAuthTokenFromStorage())
  const [payload, setPayload] = useState<AuthPayload>(initialPayload)
  const [isAuthenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const payload = decodeJWT(authToken)
    storage.setItem('authToken', authToken)
    storage.setItem('payload', JSON.stringify(payload))
    if (authToken.length) {
      setPayload(payload)
      setAuthenticated(isUserAuthenticated(payload))
    }
  }, [setPayload, setAuthenticated, authToken])

  const logout = () => {
    storage.removeItem('authToken')
    storage.removeItem('payload')
    setAuthToken('')
    setPayload(defaultValue.payload)
    setAuthenticated(false)
  }

  const hasRole = (role: EAuthRoles) => payload.roles.includes(role)

  const value = {
    payload,
    isAuthenticated,
    hasRole,
    setAuthToken,
    logout,
    authToken,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider

function getAuthTokenFromStorage(): string | (() => string) {
  const token = storage.getItem('authToken')

  // TODO #40 handle Expired JWT Token(401)

  return token || ''
}
