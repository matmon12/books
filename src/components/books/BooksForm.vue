<template>
  <form class="form" @submit.prevent="handleSubmit">
    <h1 class="form__title">Заполните форму</h1>

    <div v-if="!isValid && isTouched" class="form__status">
      <i-ion:warning-outline />
      <span class="form__status-message">
        Пожалуйста, исправьте ошибки в форме
      </span>
    </div>

    <div class="form__fields">
      <AppFormItem
        label="Название"
        required
        :error="fieldStates.title.errors[0]"
      >
        <AppInput
          v-model="formData.title"
          class="form__input"
          :invalid="fieldStates.title.errors.length > 0"
          placeholder="Введите название книги"
          @blur="touchField('title')"
        />
      </AppFormItem>

      <AppFormItem label="Автор" required :error="fieldStates.author.errors[0]">
        <AppInput
          v-model="formData.author"
          class="form__input"
          :invalid="fieldStates.author.errors.length > 0"
          placeholder="Введите имя автора"
          @blur="touchField('author')"
        />
      </AppFormItem>

      <AppFormItem
        label="Год издания"
        required
        :error="fieldStates.year.errors[0]"
      >
        <AppInput
          v-model="formData.year"
          type="number"
          class="form__input"
          :invalid="fieldStates.year.errors.length > 0"
          placeholder="2024"
          @blur="touchField('year')"
        />
      </AppFormItem>

      <AppFormItem
        label="Количество страниц"
        :error="fieldStates.pages.errors[0]"
      >
        <AppInput
          v-model="formData.pages"
          type="number"
          class="form__input"
          :invalid="fieldStates.pages.errors.length > 0"
          placeholder="300"
          @blur="touchField('pages')"
        />
      </AppFormItem>

      <AppFormItem label="Описание" :error="fieldStates.description.errors[0]">
        <AppInput
          v-model="formData.description"
          as-textarea
          class="form__input form__input--textarea"
          :invalid="fieldStates.description.errors.length > 0"
          placeholder="Краткое описание книги..."
          rows="4"
          @blur="touchField('description')"
        />
      </AppFormItem>
    </div>

    <div class="form__actions">
      <AppButton
        type="submit"
        :label="isLoading ? 'Добавление...' : 'Добавить книгу'"
        :disabled="!isValid || isLoading"
      />
      <AppButton severity="secondary" label="Очистить" @click="handleReset" />
    </div>

    <AppAlert
      type="error"
      title="Ошибка при добавлении"
      :message="error?.message"
      :autoclose="3000"
      @dismiss="error = null"
    />

    <AppAlert
      type="success"
      title="Успешно"
      :message="isSuccess ? 'Книга успешно добавлена' : ''"
      :autoclose="3000"
      @dismiss="status = 'idle'"
    />
  </form>
</template>

<script setup lang="ts">
import type { ValidationConfig } from '@/composables/useFormValidation'
import { useFormValidation } from '@/composables/useFormValidation'
import { useApi } from '@/composables/useApi'
import type { Book } from '@/types/books'

// Эмитим событие для обновления таблицы
const emit = defineEmits<{
  (e: 'book-added'): void
}>()

interface BookForm {
  title: string
  author: string
  year: number | null
  pages: number | null
  description: string
}

const formData = reactive<BookForm>({
  title: '',
  author: '',
  year: null,
  pages: null,
  description: '',
})

const validationRules: ValidationConfig<BookForm> = {
  title: [
    {
      validator: (v: string) => !!(v && v.trim().length),
      message: 'Название книги обязательно для заполнения',
    },
    {
      validator: (v: string) => !v || v.trim().length >= 2,
      message: 'Название должно содержать минимум 2 символа',
    },
    {
      validator: (v: string) => !v || v.trim().length <= 200,
      message: 'Название не должно превышать 200 символов',
    },
  ],
  author: [
    {
      validator: (v: string) => !!(v && v.trim().length),
      message: 'Имя автора обязательно для заполнения',
    },
    {
      validator: (v: string) => !v || v.trim().length >= 2,
      message: 'Имя автора должно содержать минимум 2 символа',
    },
  ],
  year: [
    {
      validator: (v: number | null) => v != null,
      message: 'Год издания обязателен для заполнения',
    },
    {
      validator: (v: number | null) => v == null || v > 1000,
      message: 'Год издания должен быть не ранее 1000 года',
    },
    {
      validator: (v: number | null) =>
        v == null || v <= new Date().getFullYear(),
      message: `Год издания не может быть больше ${new Date().getFullYear()}`,
    },
  ],
  pages: [
    {
      validator: (v: number | null) => v == null || v >= 1,
      message: 'Количество страниц должно быть больше 0',
    },
    {
      validator: (v: number | null) => v == null || v <= 1000,
      message: 'Количество страниц не должно превышать 1000',
    },
  ],
  description: [
    {
      validator: (v: string) => !v || v.trim().length <= 2000,
      message: 'Описание не должно превышать 2000 символов',
    },
  ],
}

// Использование composable для валидации
const { fieldStates, touchField, validateForm, resetForm, isValid, isTouched } =
  useFormValidation(formData, validationRules)

// Использование composable для API
const { post, isLoading, error, isSuccess, status } = useApi<Book[]>({
  url: 'https://f1f047f00ee98413.mokky.dev/books',
})

// Обработка отправки формы
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  await post(undefined, formData)
  if (isSuccess.value) {
    handleReset()
    // Эмитим событие для обновления таблицы
    emit('book-added')
  }
}

// Сброс формы
const handleReset = () => {
  formData.title = ''
  formData.author = ''
  formData.year = null
  formData.pages = null
  formData.description = ''
  resetForm()
}
</script>

<style scoped lang="scss">
.form {
  background-color: var(--neutral-900);
  padding: 25px;
  border-radius: var(--border-radius-xl);
  border: 1px solid var(--neutral-800);

  &__title {
    margin-bottom: 20px;
    font-size: 30px;
    font-weight: 600;
    color: var(--white);
    line-height: 1;
    text-align: center;
    color: var(--lime-300);
  }

  &__fields {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
  }

  &__status {
    margin-bottom: 16px;
    padding: 16px;
    background: color-mix(in srgb, var(--red-400), transparent 90%);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--red-400);
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      font-size: 20px;
      color: var(--red-500);
    }

    &-message {
      font-size: 14px;
      color: var(--red-200);
    }
  }
}

.api-status {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #000000;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  &--success {
    background: #f0fdf4;
    border-color: #86efac;
  }

  &--error {
    background: #fef2f2;
    border-color: #fecaca;
  }
}

.status-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;
}

.status-value {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  text-transform: uppercase;

  &--idle {
    background: #e5e7eb;
    color: #6b7280;
  }

  &--loading {
    background: #dbeafe;
    color: #2563eb;
  }

  &--success {
    background: #dcfce7;
    color: #16a34a;
  }

  &--error {
    background: #fee2e2;
    color: #dc2626;
  }
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.response-data {
  margin: 0.5rem 0 0 0;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  overflow-x: auto;
  color: #374151;
}

.error-text {
  margin: 0;
  color: #dc2626;
  font-size: 0.875rem;
}
</style>
