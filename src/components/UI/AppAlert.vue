<template>
  <transition @enter="onEnter" @leave="onLeave">
    <div
      v-if="props.message"
      :class="['app-alert', `app-alert--${props.type}`]"
    >
      <component :is="iconComponent" class="app-alert__icon" />
      <div class="app-alert__content">
        <p v-if="props.title" class="app-alert__title">{{ props.title }}</p>
        <p class="app-alert__message">{{ props.message }}</p>
      </div>
      <button
        v-if="props.dismissible"
        class="app-alert__close"
        @click="emit('dismiss')"
      >
        <i-fluent:dismiss-24-regular />
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import MaterialSymbolsLightErrorOutline from '~icons/material-symbols-light/error-outline'
import MaterialSymbolsLightWarningAmber from '~icons/material-symbols-light/warning'
import MaterialSymbolsLightInfoOutline from '~icons/material-symbols-light/info-outline'
import MaterialSymbolsLightCheckCircleOutline from '~icons/material-symbols-light/check-circle-outline'

type AlertType = 'error' | 'warning' | 'info' | 'success'

const props = withDefaults(
  defineProps<{
    type?: AlertType
    title?: string
    message?: string | null
    dismissible?: boolean
    autoclose?: number
  }>(),
  {
    type: 'error',
    title: undefined,
    message: undefined,
    dismissible: false,
    autoclose: undefined,
  },
)

const emit = defineEmits<{ dismiss: [] }>()

const ANIMATION_EASING = 'ease'
const ANIMATION_DURATION = 300
const autocloseTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const iconComponent = computed<Component>(() => {
  const icons: Record<AlertType, Component> = {
    error: MaterialSymbolsLightErrorOutline,
    warning: MaterialSymbolsLightWarningAmber,
    info: MaterialSymbolsLightInfoOutline,
    success: MaterialSymbolsLightCheckCircleOutline,
  }
  return icons[props.type]
})

const onEnter = async (el: Element, done: () => void) => {
  if (!(el instanceof HTMLElement)) return

  el.style.opacity = '0'
  el.style.transform = 'scale(0.5)'

  const animation = el.animate(
    {
      opacity: 1,
      transform: 'scale(1)',
    },
    { duration: ANIMATION_DURATION, easing: ANIMATION_EASING },
  )

  animation.finished.finally(() => {
    el.style.opacity = ''
    el.style.transform = ''
    done()
  })
}

const onLeave = (el: Element, done: () => void) => {
  if (!(el instanceof HTMLElement)) return

  el.style.opacity = '1'
  el.style.transform = 'scale(1) translateY(0)'
  el.style.transformOrigin = 'center center'

  const animation = el.animate(
    {
      opacity: 0,
      transform: 'scale(0.5) translateY(-50%)',
      transformOrigin: 'top center',
    },
    { duration: ANIMATION_DURATION, easing: ANIMATION_EASING },
  )

  animation.finished.finally(() => {
    el.style.opacity = ''
    el.style.transform = ''
    el.style.transformOrigin = ''
    done()
  })
}

const startAutocloseTimer = () => {
  if (autocloseTimer.value) {
    clearTimeout(autocloseTimer.value)
    autocloseTimer.value = null
  }

  if (props.message && props.autoclose) {
    autocloseTimer.value = setTimeout(() => {
      emit('dismiss')
      autocloseTimer.value = null
    }, props.autoclose)
  }
}

watch(
  () => props.message,
  () => {
    startAutocloseTimer()
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  if (autocloseTimer.value) {
    clearTimeout(autocloseTimer.value)
    autocloseTimer.value = null
  }
})
</script>

<style scoped lang="scss">
.app-alert {
  max-width: 500px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 9999;
  overflow: hidden;

  &--error {
    border-color: var(--red-500);
    color: var(--red-300);
    background-color: color-mix(in srgb, var(--red-700), transparent 90%);

    .app-alert__icon,
    .app-alert__title,
    .app-alert__close {
      color: var(--red-500);
    }
  }

  &--warning {
    border-color: var(--yellow-500);
    color: var(--yellow-300);
    background-color: color-mix(in srgb, var(--yellow-700), transparent 90%);

    .app-alert__icon,
    .app-alert__title,
    .app-alert__close {
      color: var(--yellow-500);
    }
  }

  &--info {
    border-color: var(--blue-500);
    color: var(--blue-300);
    background-color: color-mix(in srgb, var(--blue-700), transparent 90%);

    .app-alert__icon,
    .app-alert__title,
    .app-alert__close {
      color: var(--blue-500);
    }
  }

  &--success {
    border-color: var(--green-500);
    color: var(--green-300);
    background-color: color-mix(in srgb, var(--green-700), transparent 90%);

    .app-alert__icon,
    .app-alert__title,
    .app-alert__close {
      color: var(--green-500);
    }
  }

  &__icon {
    flex-shrink: 0;
    font-size: 24px;
    margin-top: 2px;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
  }

  &__message {
    font-size: 14px;
  }

  &__close {
    flex-shrink: 0;
    color: inherit;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    svg {
      font-size: 18px;
    }
  }
}
</style>
