<template>
  <input
    v-if="!props.asTextarea"
    :id="inputId"
    v-bind="filteredAttrs"
    v-model="inputValue"
    :class="['input', { 'is--invalid': props.invalid }]"
    @blur="emits('blur', $event)"
  />
  <textarea
    v-else
    :id="inputId"
    v-bind="filteredAttrs"
    v-model="inputValue"
    :class="['input', 'textarea', { 'is--invalid': props.invalid }]"
    @blur="emits('blur', $event)"
  />
</template>

<script setup lang="ts">
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'vue'

defineOptions({
  inheritAttrs: false,
})

type InputProps = {
  invalid?: boolean
  asTextarea?: boolean
} & /* @vue-ignore */ (InputHTMLAttributes & TextareaHTMLAttributes)

interface InputEmits {
  blur: [event: Event]
}

const props = withDefaults(defineProps<InputProps>(), {
  asTextarea: false,
  invalid: false,
})

const attrs = useAttrs() as InputHTMLAttributes & TextareaHTMLAttributes
const emits = defineEmits<InputEmits>()

const modelValue = defineModel<string | number | null | undefined>()
const injectId = inject<string | undefined>('formItemId', undefined)
const notifyIdUsed = inject<(() => void) | undefined>(
  'formItemIdUsed',
  undefined,
)

// Уведомляем об использовании ID родительский компонент
if (injectId && notifyIdUsed) {
  notifyIdUsed()
}

const filteredAttrs = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = attrs

  return rest
})

const inputId = computed<string | undefined>(
  () => attrs.id || injectId || undefined,
)

const inputValue = computed<string | number | null | undefined>({
  get: () => modelValue.value,
  set: (newValue) => {
    let normalizedValue = newValue
    if (!props.asTextarea && attrs.type === 'number' && newValue === '') {
      normalizedValue = null
    }
    modelValue.value = normalizedValue
  },
})
</script>

<style scoped lang="scss">
.input {
  padding: 10px 12px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--neutral-700);
  background-color: var(--neutral-800);
  color: var(--white);
  font-size: 16px;
  transition: border-color 0.3s;

  &::placeholder {
    color: var(--neutral-400);
  }

  &.is--invalid {
    border-color: var(--red-400);
  }

  &:hover {
    border-color: var(--neutral-600);
  }

  &:focus {
    outline: none;
    border-color: var(--lime-400);
  }

  &[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      display: none;
      margin: 0;
    }
  }
}

.textarea {
  resize: none;
  min-height: 80px;
}
</style>
