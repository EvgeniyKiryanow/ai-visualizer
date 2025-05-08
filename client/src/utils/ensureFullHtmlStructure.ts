import { NodeTree } from './htmlToJsonTree'

export function ensureFullHtmlStructure(tree: NodeTree[]): NodeTree[] {
  const hasHtml = tree.some(node => node.tag === 'html')
  if (hasHtml) return tree

  const doctype: NodeTree = {
    tag: '!doctype',
    children: []
  }

//   TODO: update tags add all models 3D plus update position
  const head: NodeTree = {
    tag: 'head',
    children: [
    //   { tag: 'meta', children: [] },
    //   { tag: 'meta', children: [] },
    //   { tag: 'meta', children: [] },
      { tag: 'title', children: [] },
    //   { tag: 'link', children: [] },
    //   { tag: 'base', children: [] },
    //   { tag: 'style', children: [] },
    //   { tag: 'script', children: [] },
    //   { tag: 'noscript', children: [] }
    ]
  }

  const body: NodeTree = {
    tag: 'body',
    children: [...tree]
  }

  const html: NodeTree = {
    tag: 'html',
    children: [head, body]
  }

  return [doctype, html]
}
