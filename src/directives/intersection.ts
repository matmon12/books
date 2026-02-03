import type { Directive, DirectiveBinding } from 'vue'

interface IntersectionBinding {
  active: () => void
}

const directive: Directive<HTMLElement, IntersectionBinding> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<IntersectionBinding>) {
    const options: IntersectionObserverInit = {
      rootMargin: '0px',
      threshold: 0,
    }

    const callback: IntersectionObserverCallback = (entries, observer) => {
      if (entries[0]?.isIntersecting) {
        binding.value.active()
        observer.unobserve(el)
      }
    }

    const observer = new IntersectionObserver(callback, options)
    observer.observe(el)
  }
}

export default directive
