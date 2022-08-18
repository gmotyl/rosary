import {decodeJWT, isUserAuthenticated} from '../auth'
import {ExpansionPanelActions} from '@mui/material'
import {EAuthRoles} from 'src/context/AuthProvider'

it('should decode JWT', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6InRlc3RAdGVzdC5wbCIsInJvbGUiOiJST0xFX1VTRVIifQ.qfKooWSjhJsB94ijsvWOpjNcDuS5nJIJaCfNW-rl97k'
  const payload = {
    id: '1234567890',
    email: 'test@test.pl',
    role: 'ROLE_USER',
  }

  const decoded = decodeJWT(token)

  expect(decoded).toEqual(payload)
})

it('should determine if user is logged in based on payload', () => {
  const payloadTrue = {
    iat: 1234,
    exp: Date.now(),
    roles: [EAuthRoles.ROLE_ADMIN, EAuthRoles.ROLE_USER],
    username: 'test@orareprome.com',
    id: '11aaa1a1-2345-6789-99aa-a0ee00d00aa0',
  }
  const payloadFalse = {
    iat: 1234,
    exp: 1589528528,
    roles: [EAuthRoles.ROLE_UNAUTHORIZED],
    username: 'test@orareprome.com',
    id: '11aaa1a1-2345-6789-99aa-a0ee00d00aa0',
  }

  expect(isUserAuthenticated(payloadFalse)).toBeFalsy()
  expect(isUserAuthenticated(payloadTrue)).toBeTruthy()
})
