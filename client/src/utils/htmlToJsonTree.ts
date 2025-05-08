export interface NodeTree {
    tag: string
    text?: string
    children: NodeTree[]
  }
  
  export function parseHtmlToTree(html: string): NodeTree[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
  
    function walk(node: HTMLElement): NodeTree {
      const children: NodeTree[] = []
      node.childNodes.forEach((child) => {
        if (child.nodeType === 1) {
          children.push(walk(child as HTMLElement))
        } else if (child.nodeType === 3 && child.textContent?.trim()) {
          children.push({ tag: '#text', text: child.textContent.trim(), children: [] })
        }
      })
      return { tag: node.tagName.toLowerCase(), children }
    }
  
    const body = doc.body
    return Array.from(body.children).map((el) => walk(el as HTMLElement))
  }
  