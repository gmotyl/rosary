import {useContext} from 'react'
import {Route, Redirect, RouteProps} from 'react-router-dom'
import {AuthContext} from 'src/context/AuthProvider'

export const PrivateRoute: React.FC<RouteProps> = ({children, ...rest}) => {
  const {isAuthenticated} = useContext(AuthContext)

  return (
    <Route
      {...rest}
      render={({location}) =>
        isAuthenticated ? (
          (children as any)
        ) : (
          // <div>{location.pathname}</div>
          <Redirect
            to={{
              pathname: '/login',
              state: {from: location},
            }}
          />
        )
      }
    />
  )
}
