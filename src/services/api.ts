import axios, {AxiosResponse} from 'axios'
import {appConfig} from 'src/app/config/appConfig'

const config = {
  baseURL: appConfig.rosaryApiUrl,
  headers: {accept: 'application/json'},
  timeout: 5000,
}

export const isApiError = (error: unknown): error is ApiError => {
  // return (error as ApiError) !== undefined
  return true
}

export type ApiError =
  | {
      isError: false
    }
  | {
      isError: true
      message: string
      code: number
    }

const handleResponseError = (error: any) => {
  if (error.response) {
    const response: AxiosResponse = error.response
    //   // The request was made and the server responded with a status code
    //   // that falls out of the range of 2xx
    console.error(
      `ERROR |--> status: ${
        response.status
      } | error.response.data: ${JSON.stringify(response.data)}`,
    )
    return Promise.reject({
      isError: true,
      message: error.message,
      code: response.status,
    })
  } else {
    console.error(`ERROR | error: ${error}`)
    return Promise.reject({
      isError: true,
      message: `Wystąpił błąd : ${error.message}`,
      code: 500,
    })
  }
}

const handleRequestError = (error: any) => {
  if (error.request) {
    const request: XMLHttpRequest = error.request
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error('ERROR | The request was made but no response was received')
    return Promise.reject({
      isError: true,
      message: 'Serwer nie odpowiada. Spróbuj ponownie.',
      code: request.status,
    })
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error(`ERROR | error.message: ${error.message}`)
    return Promise.reject({
      isError: true,
      message: `Błąd: ${error.message}`,
      code: 500,
    })
  }
}

export const api = axios.create(config)

api.interceptors.request.use((config) => config, handleRequestError)
api.interceptors.response.use((response) => response, handleResponseError)

export const authApi = (authToken: string) => {
  const instance = axios.create({
    ...config,
    headers: {...config.headers, Authorization: `Bearer ${authToken}`},
  })
  instance.interceptors.request.use((config) => config, handleRequestError)
  instance.interceptors.response.use(
    (response) => response,
    handleResponseError,
  )

  return instance
}

export default api
