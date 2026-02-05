/* eslint-disable @typescript-eslint/no-explicit-any */

// тип для http методов
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// тип для конфигурации HTTP запроса
export interface ApiRequestConfig {
  url: string
  method?: HttpMethod
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string | number | boolean>
}

// тип для состояния HTTP запроса
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * Composable для работы с API
 * @param baseConfig - Базовая конфигурация для всех запросов (опционально)
 * @returns Объект с методами и реактивным состоянием
 */
export function useApi<T = any>(baseConfig?: Partial<ApiRequestConfig>) {
  // данные
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const status = ref<RequestStatus>('idle')
  const statusCode = ref<number | null>(null)

  // состояния
  const isLoading = computed(() => status.value === 'loading')
  const isSuccess = computed(() => status.value === 'success')
  const isError = computed(() => status.value === 'error')
  const isIdle = computed(() => status.value === 'idle')

  // Построение URL с параметрами
  const buildUrl = (
    url: string,
    params?: Record<string, string | number | boolean>,
  ): string => {
    if (!params || Object.keys(params).length === 0) {
      return url
    }

    const urlObj = new URL(url, window.location.origin)
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, String(value))
    })

    return urlObj.toString()
  }

  /**
   * Выполнение HTTP запроса
   */
  const execute = async (
    config: Partial<ApiRequestConfig>,
  ): Promise<T | null> => {
    error.value = null
    status.value = 'loading'

    try {
      // Объединение базовой конфигурации и конфигурации запроса
      const finalConfig: Partial<ApiRequestConfig> = {
        ...baseConfig,
        ...config,
        headers: {
          ...baseConfig?.headers,
          ...config.headers,
        },
      }

      // Проверка наличия URL
      if (!finalConfig.url) {
        throw new Error(
          'URL is required. Provide it either in baseConfig or in the request config.',
        )
      }

      // Построение URL
      const finalUrl = buildUrl(finalConfig.url, finalConfig.params)

      // Подготовка опций для fetch
      const fetchOptions: RequestInit = {
        method: finalConfig.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...finalConfig.headers,
        },
      }

      // Добавление body для методов, которые его поддерживают
      if (
        finalConfig.body &&
        ['POST', 'PUT', 'PATCH'].includes(finalConfig.method || 'GET')
      ) {
        fetchOptions.body = JSON.stringify(finalConfig.body)
      }

      // Выполнение запроса
      const response = await fetch(finalUrl, fetchOptions)
      statusCode.value = response.status

      // Обработка HTTP ошибки (400, 500), которые не являются исключениями
      // выбрасываем исключения для единообразия обработки
      if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {}

        throw new Error(errorMessage)
      }

      // Парсинг ответа
      const contentType = response.headers.get('content-type')
      let responseData: T

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
      } else {
        responseData = (await response.text()) as unknown as T
      }

      // Успешный ответ
      data.value = responseData
      status.value = 'success'
      error.value = null

      return responseData
    } catch (err) {
      const apiError =
        err instanceof Error ? err : new Error('Unknown error occurred')
      error.value = apiError
      status.value = 'error'
      data.value = null

      return null
    }
  }

  /**
   * Сброс состояний
   */
  const reset = () => {
    data.value = null
    error.value = null
    status.value = 'idle'
    statusCode.value = null
  }

  // Методы для разных HTTP методов
  const get = (
    url?: string,
    config?: Omit<ApiRequestConfig, 'url' | 'method' | 'body'>,
  ) => {
    return execute({ ...config, ...(url && { url }), method: 'GET' })
  }

  const post = (
    url?: string,
    body?: any,
    config?: Omit<ApiRequestConfig, 'url' | 'method' | 'body'>,
  ) => {
    return execute({
      ...config,
      ...(url && { url }),
      method: 'POST',
      ...(body && { body }),
    })
  }

  const put = (
    url?: string,
    body?: any,
    config?: Omit<ApiRequestConfig, 'url' | 'method' | 'body'>,
  ) => {
    return execute({
      ...config,
      ...(url && { url }),
      method: 'PUT',
      ...(body && { body }),
    })
  }

  const patch = (
    url?: string,
    body?: any,
    config?: Omit<ApiRequestConfig, 'url' | 'method' | 'body'>,
  ) => {
    return execute({
      ...config,
      ...(url && { url }),
      method: 'PATCH',
      ...(body && { body }),
    })
  }

  const del = (
    url?: string,
    config?: Omit<ApiRequestConfig, 'url' | 'method' | 'body'>,
  ) => {
    return execute({ ...config, ...(url && { url }), method: 'DELETE' })
  }

  return {
    // данные
    data,
    error,
    status,
    statusCode,

    // состояния
    isLoading,
    isSuccess,
    isError,
    isIdle,

    // методы
    execute,
    reset,
    get,
    post,
    put,
    patch,
    del,
  }
}
