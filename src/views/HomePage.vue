<template>
  <div class="home-page">
    <h1 class="home-page__title">Добавление новой книги</h1>
    <BooksForm class="home-page__form" @book-added="handleBookAdded"  />
    <BooksTable ref="booksTableRef" />
  </div>
</template>

<script setup lang="ts">
import BooksTable from '@/components/books/BooksTable.vue'

const booksTableRef = ref<InstanceType<typeof BooksTable> | null>(null)

const handleBookAdded = () => {
  // Вызываем метод обновления таблицы
  if (booksTableRef.value) {
    booksTableRef.value.refresh()
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 900px;
  margin: 0 auto;

  &__title {
    font-size: 35px;
    font-weight: 700;
    margin-bottom: 25px;
  }

  &__form {
    margin-bottom: 25px;
  }
}
</style>
