import { NodeTree } from './htmlToJsonTree'

export function ensureFullHtmlStructure(tree: NodeTree[]): NodeTree[] {
  const hasHtml = tree.some(node => node.tag === 'html')
  if (hasHtml) return tree

  // DOCTYPE (не має children, але може бути візуалізований окремо)
  const doctype: NodeTree = {
    tag: '!doctype',
    children: []
  }

  // HEAD: те, що зазвичай автоматично додає браузер
  const head: NodeTree = {
    tag: 'head',
    children: [
      { tag: 'meta', children: [] },
      { tag: 'meta', children: [] },
      { tag: 'meta', children: [] },
      { tag: 'title', children: [] },
      { tag: 'link', children: [] },
      { tag: 'style', children: [] },
      { tag: 'script', children: [] }
    ]
  }

  // BODY: включає те, що було у твоєму HTML
  const body: NodeTree = {
    tag: 'body',
    children: [...tree]
  }

  // HTML обʼєднує HEAD і BODY
  const html: NodeTree = {
    tag: 'html',
    children: [head, body]
  }

  return [doctype, html]
}
