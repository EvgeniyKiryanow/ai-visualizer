// TODO: update this func// utils/css/doesSelectorMatch.ts

import { NodeTree } from '../html/htmlToJsonTree'

/**
 * Перевіряє, чи CSS-селектор відповідає вузлу HTML-дерева
 */
export function doesSelectorMatch(node: NodeTree, selector: string): boolean {
  if (selector.startsWith('.')) {
    return node.attributes?.class?.split(/\s+/).includes(selector.slice(1)) ?? false
  }
  if (selector.startsWith('#')) {
    return node.attributes?.id === selector.slice(1)
  }
  return node.tag === selector
}