export interface NodeTree {
    tag: string
    text?: string
    attributes?: Record<string, string>
    children: NodeTree[]
  }
  
  export function parseHtmlToTree(html: string): NodeTree[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
  
    // Додаємо DOCTYPE окремо
    const tree: NodeTree[] = [{
      tag: '!doctype',
      children: []
    }]
  
    function walk(node: Element): NodeTree {
        const children: NodeTree[] = []
      
        node.childNodes.forEach((child) => {
          if (child.nodeType === 1) {
            children.push(walk(child as HTMLElement))
          } else if (child.nodeType === 3 && child.textContent?.trim()) {
            children.push({
              tag: '#text',
              text: child.textContent.trim(),
              children: []
            })
          }
        })
      
        // 🛠 Виправлено: NamedNodeMap → Array.from
        const attributes: Record<string, string> = {}
        Array.from(node.attributes).forEach(attr => {
          attributes[attr.name] = attr.value
        })
      
        return {
          tag: node.tagName.toLowerCase(),
          attributes,
          children
        }
      }
      
  
    const htmlElement = doc.documentElement
    tree.push(walk(htmlElement))
  
    return tree
  }
  export function extractStyleBlocks(doc: Document): string[] {
    const styleTags = Array.from(doc.querySelectorAll('style'))
    return styleTags.map(tag => tag.textContent || '').filter(Boolean)
  }