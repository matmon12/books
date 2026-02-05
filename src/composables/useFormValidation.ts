/* eslint-disable @typescript-eslint/no-explicit-any */

// тип для правила валидации
export type ValidationRule = {
  validator: (value: any) => boolean | string
  message?: string
}

// тип для правил валидации поля
export type FieldRules = ValidationRule[]

// тип для конфигурации валидации формы
export type ValidationConfig<T extends Record<string, any>> = {
  [K in keyof T]: FieldRules
}

// тип для состояния валидации поля
export type FieldValidationState = {
  isValid: boolean
  errors: string[]
  touched: boolean
}

// тип для состояния валидации формы
export type FormValidationState<T extends Record<string, any>> = {
  [K in keyof T]: FieldValidationState
}

/**
 * Composable для валидации форм
 * @param formData - Данные формы
 * @param validationRules - Правила валидации для каждого поля
 * @returns Объект с состоянием валидации
 */
export function useFormValidation<T extends Record<string, any>>(
  formData: T,
  validationRules: ValidationConfig<T>,
) {
  // состояние валидации для каждого поля
  const fieldStates = reactive<FormValidationState<T>>(
    {} as FormValidationState<T>,
  ) as FormValidationState<T>

  // инициализация состояний полей (для которых есть правила)
  Object.keys(validationRules).forEach((key) => {
    fieldStates[key as keyof T] = {
      isValid: true,
      errors: [],
      touched: false,
    }
  })

  /**
   * Валидация одного поля
   */
  const validateField = (fieldName: keyof T): boolean => {
    const value = formData[fieldName]
    const rules = validationRules[fieldName]
    const state = fieldStates[fieldName]

    // поля, для которых нет правил, считаются валидными
    if (rules.length === 0) {
      state.isValid = true
      state.errors = []
      return true
    }

    const errors: string[] = []

    for (const rule of rules) {
      const result = rule.validator(value)

      if (result === false) {
        const errorMessage =
          rule.message || `Поле "${String(fieldName)}" не прошло валидацию`
        errors.push(errorMessage)
      } else if (typeof result === 'string') {
        errors.push(result)
      }
    }

    state.isValid = errors.length === 0
    state.errors = errors

    return state.isValid
  }

  /**
   * Валидация всех полей формы
   */
  const validateForm = (): boolean => {
    let isValid = true

    Object.keys(validationRules).forEach((fieldName: keyof T) => {
      const fieldValid = validateField(fieldName)
      if (!fieldValid) {
        isValid = false
      }
    })

    return isValid
  }

  /**
   * Отметить поле как тронутое
   */
  const touchField = (fieldName: keyof T) => {
    const state = fieldStates[fieldName]
    if (state) {
      state.touched = true
      validateField(fieldName)
    }
  }

  /**
   * Сброс валидации одного поля
   */
  const resetField = (fieldName: keyof T) => {
    const state = fieldStates[fieldName]
    if (state) {
      state.isValid = true
      state.errors = []
      state.touched = false
    }
  }

  /**
   * Сброс валидации всех полей формы
   */
  const resetForm = () => {
    Object.keys(validationRules).forEach((fieldName) => {
      resetField(fieldName as keyof T)
    })
  }

  /**
   * Общая валидность формы
   */
  const isValid = computed(() => {
    return Object.values(fieldStates).every((state) => state.isValid)
  })

  /**
   * Есть ли ошибки в форме
   */
  const hasErrors = computed(() => {
    return Object.values(fieldStates).some((state) => state.errors.length > 0)
  })

  /**
   * Все ли поля были тронуты
   */
  const isTouched = computed(() => {
    return Object.values(fieldStates).every((state) => state.touched)
  })

  // Автоматическая валидация при изменении значения поля если есть хоть одна ошибка
  watch(
    () => formData,
    () => {
      Object.keys(validationRules).forEach((fieldName: keyof T) => {
        const state = fieldStates[fieldName]
        if (state && state.errors.length > 0) {
          validateField(fieldName)
        }
      })
    },
    { deep: true },
  )

  return {
    // Состояние
    fieldStates,
    isValid,
    hasErrors,
    isTouched,

    // Методы
    validateField,
    validateForm,
    touchField,
    resetField,
    resetForm,
  }
}
