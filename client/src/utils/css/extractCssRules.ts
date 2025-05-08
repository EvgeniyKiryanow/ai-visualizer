export interface CssRule {
    selector: string
    declarations: Record<string, string>
  }
  
  export function extractCssRules(css: string): CssRule[] {
    const rules: CssRule[] = []
    const regex = /([^{]+){([^}]+)}/g
    let match
  
    while ((match = regex.exec(css)) !== null) {
      const selector = match[1].trim()
      const declarations: Record<string, string> = {}
  
      match[2].split(';').forEach(decl => {
        const [prop, value] = decl.split(':')
        if (prop && value) {
          declarations[prop.trim()] = value.trim()
        }
      })
  
      rules.push({ selector, declarations })
    }
  
    return rules
  }
  