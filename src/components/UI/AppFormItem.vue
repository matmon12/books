<template>
  <div class="app-form-item">
    <component
      :is="idUsed ? 'label' : 'div'"
      v-if="props.label"
      :for="idUsed ? id : undefined"
      :class="[
        'app-form-item__label',
        { 'app-form-item__label--required': props.required },
      ]"
    >
      {{ props.label }}
    </component>

    <div class="app-form-item__content">
      <slot></slot>

      <transition @enter="onEnter" @leave="onLeave">
        <div v-if="props.error" class="app-form-item__error">
          <slot
            name="error"
            :error="props.error"
            :error-class="'app-form-item__error-text'"
          >
            <div class="app-form-item__error-text">{{ props.error }}</div>
          </slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{ label?: string; required?: boolean; error?: string }>(),
  { label: undefined, required: false, error: undefined },
)

const id = `form-item_${useId()}`
const idUsed = ref(false)

const ANIMATION_EASING = 'ease-in-out'
const ANIMATION_DURATION = 300

const onEnter = async (el: Element, done: () => void) => {
  if (!(el instanceof HTMLElement)) return

  const targetHeight = el.offsetHeight

  el.style.height = '0'
  el.style.opacity = '0'

  const animation = el.animate(
    { height: `${targetHeight}px`, opacity: 1 },
    { duration: ANIMATION_DURATION, easing: ANIMATION_EASING },
  )

  animation.finished.finally(() => {
    el.style.height = ''
    el.style.opacity = ''
    done()
  })
}

const onLeave = (el: Element, done: () => void) => {
  if (!(el instanceof HTMLElement)) return

  el.style.height = `${el.offsetHeight}px`
  el.style.opacity = '1'

  const animation = el.animate(
    { height: 0, opacity: 0 },
    { duration: ANIMATION_DURATION, easing: ANIMATION_EASING },
  )

  animation.finished.finally(() => {
    el.style.height = ''
    el.style.opacity = ''
    done()
  })
}
// Предоставляем ID и функцию для уведомления об использовании
provide('formItemId', id)
provide('formItemIdUsed', () => {
  idUsed.value = true
})
</script>

<style scoped lang="scss">
.app-form-item {
  display: flex;
  flex-direction: column;

  &__label {
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 16px;
    line-height: 1;
    color: var(--white);

    &--required {
      &::after {
        content: '*';
        color: var(--red-400);
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__error {
    display: flex;
  }

  &__error-text {
    font-size: 12px;
    line-height: 1;
    color: var(--red-400);
    padding-top: 3px;
  }
}
</style>
