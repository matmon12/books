<template>
  <button
    class="app-button"
    :disabled="props.disabled"
    :type="props.type"
    :class="['app-button', `app-button--${props.severity}`]"
  >
    <slot>
      <component :is="props.icon" class="app-button__icon" />
      <span v-if="props.label" class="app-button__label">
        {{ props.label }}
      </span>
    </slot>
  </button>
</template>

<script setup lang="ts">
interface ButtonProps {
  label?: string
  icon?: Component
  disabled?: boolean
  severity?: 'primary' | 'secondary'
  type?: 'button' | 'submit'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  label: '',
  icon: undefined,
  disabled: false,
  severity: 'primary',
  type: 'button',
})
</script>

<style scoped lang="scss">
.app-button {
  padding: 10px 17px;
  border-radius: var(--border-radius-lg);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:not(:disabled):active {
    transform: scale(0.98);
  }
}

.app-button--primary {
  background-color: var(--lime-500);
  color: var(--black);

  &:not(:disabled):hover {
    background-color: var(--lime-400);
  }
}

.app-button--secondary {
  background-color: var(--neutral-700);
  color: var(--white);
  font-weight: 400;

  &:not(:disabled):hover {
    background-color: var(--neutral-600);
  }
}
</style>
