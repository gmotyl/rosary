import React, {useEffect, useState, useContext} from 'react'
import {Grid} from '@mui/material'

import LoginCard from 'src/components/LoginCard'
import {RegisterCard} from 'src/components/RegisterCard'
import {useAuthTokenRequest} from 'src/hooks/useRosaryApi'
import {AuthContext} from 'src/context/AuthProvider'
import {Redirect, useHistory, useLocation} from 'react-router-dom'
import {usePostUser} from 'src/hooks/useRosaryApi/usePostUser'

type LocationState = {
  from: Location
}

const LoginPage = () => {
  const history = useHistory()
  const location = useLocation<LocationState>()
  const {
    token,
    requestAuthToken,
    isLoading: isLoginLoading,
    error: loginError,
  } = useAuthTokenRequest()
  const {postUser, isLoading, error: registerError, success} = usePostUser()

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const {email, password} = e.target['elements']
    if (!isLoginLoading) {
      requestAuthToken({email: email.value, password: password.value})
    }
  }

  const handleRegisterSubmit = (email: string, password: string) => {
    if (!isLoading) {
      postUser({email, password})
    }
  }

  const [redirectOnLogin, setRedirectOnLogin] = useState('')
  const {setAuthToken, isAuthenticated} = useContext(AuthContext)

  useEffect(() => {
    if (isAuthenticated) {
      const {from} = location.state || {from: null}

      if (from) {
        setRedirectOnLogin(from.pathname)
      } else history.goBack()
    }
  }, [isAuthenticated, history, location.state, setRedirectOnLogin])

  useEffect(() => {
    if (token) {
      setAuthToken(token)
    }
  }, [setAuthToken, token])

  if (redirectOnLogin) {
    return <Redirect to={redirectOnLogin} />
  }

  return (
    <>
      <Grid container={true} spacing={2}>
        <Grid item={true} key="login" xs={12} sm={6} md={12} lg={5}>
          <LoginCard handleSubmit={handleLoginSubmit} error={loginError} />
        </Grid>
        <Grid
          item={true}
          key="placeholder"
          xs="auto"
          sm={1}
          md={1}
          lg={2}
        ></Grid>
        <Grid item={true} key="register" xs={12} sm={6} md={12} lg={5}>
          <RegisterCard
            handleSubmit={handleRegisterSubmit}
            error={registerError}
            isLoading={isLoading}
            success={success}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default LoginPage
