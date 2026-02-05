<template>
  <div class="header">
    <div class="container">
      <div class="header__content">
        <router-link :to="{ name: 'HomePage' }" class="header__logo">
          <i-hugeicons:book-open-02 />
          <span>Books</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.header {
  background-color: var(--neutral-900);
  border-bottom: 1px solid var(--neutral-800);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  position: sticky;
  top: 0;
  z-index: var(--z-index-1000);

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 0;
  }

  &__logo {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--white);

    svg {
      font-size: 30px;
      color: var(--lime-400);
    }
  }
}
.container {
}
</style>
