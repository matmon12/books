<template>
  <div class="app-error">
    <div class="app-error__content">
      <i-tabler:face-id-error class="app-error__icon" />
      <p class="app-error__message">{{ props.message }}</p>
      <div class="app-error__btns">
        <AppButton
          v-if="props.backVisible"
          severity="secondary"
          class="app-error__btn app-error__btn-back"
          @click="() => props.back?.() || $router.back"
          >Назад</AppButton
        >
        <AppButton
          v-if="props.retry"
          class="app-error__btn app-error__btn-retry"
          @click="props.retry"
          >Повторить</AppButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    message: string
    retry?: () => void
    back?: () => void
    backVisible?: boolean
  }>(),
  {
    retry: undefined,
    back: undefined,
    backVisible: true,
  },
)
</script>

<style scoped lang="scss">
.app-error {
  background-color: var(--neutral-900);
  padding: 20px;
  border-radius: var(--border-radius-xl);
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  &__icon {
    width: 35%;
    color: var(--red-400);
  }

  &__message {
    text-align: center;
    font-size: 18px;
    line-height: 1.5;
  }

  &__btns {
    display: flex;
    justify-content: center;
    gap: 15px;
    width: 100%;
    margin-top: 20px;
  }

  &__btn {
    font-size: 18px;
    flex: 1;
  }
}
</style>
