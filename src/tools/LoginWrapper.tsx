import {FC, PropsWithChildren, useContext} from 'react'
import AuthProvider, {AuthContext} from 'src/context/AuthProvider'

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjEyMzQsImV4cCI6MTU4OTUyODUyOCwicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6InRlc3RAb3JhcmVwcm9tZS5jb20iLCJpZCI6IjExYWFhMWExLTIzNDUtNjc4OS05OWFhLWEwZWUwMGQwMGFhMCIsImp0aSI6IjI4NzY0NWI3LTU1YmUtNDI3ZS1hMzhkLTQ4MGM3MmE4MzIyMCJ9.VUFJdGqdLvY5Xl-u9dRVggmGAOgm2EnSmIMVwobJpG8'

beforeEach(() => {
  jest.clearAllMocks()
})

export const TestComponent: FC<PropsWithChildren<{}>> = ({children}) => {
  const {setAuthToken, logout} = useContext(AuthContext)

  return (
    <>
      {children}
      <button data-testid="login" onClick={() => setAuthToken(token)} />
      <button data-testid="logout" onClick={logout} />
    </>
  )
}
export const LoginWrapper: FC<PropsWithChildren<{}>> = ({children}) => {
  return (
    <AuthProvider>
      <TestComponent>{children}</TestComponent>
    </AuthProvider>
  )
}
