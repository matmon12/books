<template>
  <div class="table-container">
    <table
      :class="[
        'table',
        {
          'is--loading': isLoading || isError || !books || books?.length === 0,
        },
      ]"
    >
      <thead>
        <tr>
          <th>Название</th>
          <th>Автор</th>
          <th>Год</th>
          <th>Страниц</th>
          <th>Описание</th>
          <th class="table__actions">Действия</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="isLoading">
          <tr v-for="i in 5" :key="i">
            <td colspan="6" class="table__skeleton-cell">
              <AppSkeleton class="table__skeleton" />
            </td>
          </tr>
        </template>
        <tr v-else-if="isError">
          <td colspan="6">
            <AppError
              :back="() => reset()"
              :message="`Ошибка при загрузке книг: ${error?.message}`"
              class="table-error"
              :retry="() => getBooks()"
            />
          </td>
        </tr>
        <tr v-else-if="!books || books?.length === 0">
          <td colspan="6">
            <div class="table__empty">
              <img
                src="@/assets/images/empty.svg"
                alt="empty"
                class="table__empty-image"
              />
              <p class="table__empty-text">Книги не найдены</p>
            </div>
          </td>
        </tr>
        <template v-else>
          <tr v-for="book in books" :key="book.id">
            <td>
              <span class="table__title">
                {{ book.title }}
              </span>
            </td>
            <td>
              <span class="table__author">
                {{ book.author }}
              </span>
            </td>
            <td>{{ book.year }}</td>
            <td>{{ book.pages || '-' }}</td>
            <td>
              <span class="table__description">
                {{ book.description || '-' }}
              </span>
            </td>
            <td>
              <div class="table__actions-cell">
                <button
                  class="action-button action-button--delete"
                  title="Удалить"
                  :disabled="isLoadingDelete"
                  @click="deleteBook(book.id)"
                >
                  <i-svg-spinners:180-ring v-if="isLoadingDelete" />
                  <i-ic:round-delete v-else />
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <AppAlert
    type="error"
    title="Ошибка при удалении"
    :message="errorDelete?.message"
    :autoclose="3000"
    @dismiss="errorDelete = null"
  />
  <AppAlert
    type="success"
    title="Успешно"
    :message="isSuccessDelete ? 'Книга успешно удалена' : ''"
    :autoclose="3000"
    @dismiss="statusDelete = 'idle'"
  />
</template>

<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import { Book } from '@/types/books'

const {
  data: books,
  get: getBooks,
  reset,
  isLoading,
  isError,
  error,
} = useApi<Book[]>({
  url: 'https://f1f047f00ee98413.mokky.dev/books',
})

const {
  del,
  isSuccess: isSuccessDelete,
  isLoading: isLoadingDelete,
  error: errorDelete,
  status: statusDelete,
} = useApi()

const deleteBook = async (id: number) => {
  if (window.confirm('Вы действительно хотите удалить книгу?')) {
    await del(`https://f1f047f00ee98413.mokky.dev/books/${id}`)
  }
  // Обновляем список после успешного удаления
  if (isSuccessDelete.value) {
    await getBooks()
  }
}

// Предоставляем метод обновления через defineExpose
defineExpose({
  refresh: getBooks,
})

onMounted(() => {
  getBooks()
})
</script>

<style scoped lang="scss">
.table-container {
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  border: 1px solid var(--neutral-800);
  height: 400px;
  background-color: var(--neutral-900);
  overflow: auto;
  @include Scroll(5px, 5px, var(--neutral-800), var(--neutral-700));
}

.table {
  width: 100%;
  border-collapse: collapse;

  &.is--loading {
    height: 100%;
  }

  thead {
    background-color: var(--neutral-800);
    position: sticky;
    top: 0;

    &::after {
      content: '';
      height: 4px;
      width: 100%;
      background-color: var(--lime-900);
      position: absolute;
      bottom: 0;
    }
  }

  th {
    padding: 16px 16px 20px;
    text-align: left;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--white);

    &:first-child {
      border-top-left-radius: var(--border-radius-lg);
    }
    &:last-child {
      border-top-right-radius: var(--border-radius-lg);
    }
  }

  td {
    padding: 10px 16px;
    border-bottom: 1px solid var(--neutral-800);
  }

  tbody tr {
    &:last-child td {
      // border-bottom: none;
    }
  }

  .table__skeleton {
    height: 100%;
    &-cell {
      padding: 15px;
    }
  }

  &__empty {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 20px 30px 20px;
  }

  &__empty-text {
    font-size: 22px;
    margin-top: 20px;
  }

  &__empty-image {
    width: 200px;
  }

  &__title {
    @include TextOverflow(1);
  }

  &__author {
    @include TextOverflow(1);
  }

  &__description {
    @include TextOverflow(2);
  }

  &__actions {
    width: 120px;
    text-align: center;

    &-cell {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
  }
}

:deep(.table-error) {
  svg {
    max-width: 120px;
  }
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-700);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
.action-button--edit {
  color: var(--lime-300);

  &:hover {
    background-color: color-mix(in srgb, var(--lime-300), transparent 70%);
  }
}
.action-button--delete {
  color: var(--red-300);

  &:hover {
    background-color: color-mix(in srgb, var(--red-300), transparent 70%);
  }
}
</style>
