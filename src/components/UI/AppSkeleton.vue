<template>
  <div
    :class="['app-skeleton', { 'app-skeleton--rounded': props.rounded }]"
    :style="skeletonStyle"
  />
</template>

<script setup lang="ts">
import { CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    width?: string | number
    height?: string | number
    rounded?: boolean
    borderRadius?: string
  }>(),
  {
    width: undefined,
    height: undefined,
    rounded: false,
    borderRadius: undefined,
  },
)

const skeletonStyle = computed<CSSProperties>(() => {
  return {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height:
      typeof props.height === 'number' ? `${props.height}px` : props.height,
    borderRadius: props.borderRadius,
  }
})
</script>

<style scoped lang="scss">
.app-skeleton {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius-md);
  // Размеры по умолчанию, если не заданы через пропсы
  width: 100%;
  height: 1em;

  &--rounded {
    border-radius: var(--border-radius-full);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    animation: shimmer 1.2s infinite;
    transform: translateX(-100%);
    z-index: 1;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.07),
      rgba(255, 255, 255, 0)
    );
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
