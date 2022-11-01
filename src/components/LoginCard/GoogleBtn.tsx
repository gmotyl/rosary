import {FC, useContext} from 'react'
import {GoogleLogin} from 'react-google-login'
import {appConfig} from 'src/app/config/appConfig'
import {AuthContext} from 'src/context/AuthProvider'
import {useGoogleSignIn} from 'src/hooks/useRosaryApi/useGoogleSignIn'

export const GoogleBtn: FC = () => {
  const {exchangeToken} = useGoogleSignIn()
  const {setAuthToken} = useContext(AuthContext)
  const login = (response: any) => {
    if (response.accessToken) {
      exchangeToken(response.accessToken).then(setAuthToken)
    }
  }
  const handleLoginFailure = (response: any) => {
    console.log('Failed to log in')
    console.log(response)
  }

  console.log(appConfig)

  return (
    <div>
      <GoogleLogin
        clientId={appConfig.googleClientId}
        buttonText="Zaloguj się z Google"
        onSuccess={login}
        onFailure={handleLoginFailure}
        cookiePolicy={'none'}
        responseType="code,token"
        redirectUri={appConfig.googleRedirectUri}
        theme={'dark'}
      />
    </div>
  )
}
