import { ref } from 'vue'

export const activeView = ref<'html' | 'css'>('html')

export function setView(view: 'html' | 'css') {
  activeView.value = view
}
