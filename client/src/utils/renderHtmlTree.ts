import * as THREE from 'three'
import { NodeTree } from './htmlToJsonTree'
import { createArrowWithEffect } from './createArrow'
import { getModelByTag } from '../models/getModelsByTag'
import { createLabelMesh } from './threeLabel'
import { CssRule } from '../utils/extractCssRules'

function getSubtreeWidth(node: NodeTree): number {
  if (!node.children || node.children.length === 0) return 1
  return node.children.reduce((sum, child) => sum + getSubtreeWidth(child), 0)
}

function doesSelectorMatch(node: NodeTree, selector: string): boolean {
  if (selector.startsWith('.')) {
    return node.attributes?.class?.split(/\s+/).includes(selector.slice(1)) ?? false
  }
  if (selector.startsWith('#')) {
    return node.attributes?.id === selector.slice(1)
  }
  return node.tag === selector // селектор по тегу
}


export async function renderHtmlTree(
  node: NodeTree,
  scene: THREE.Scene,
  x: number,
  y: number,
  z: number,
  level: number = 0,
  cssRules: CssRule[] = []
): Promise<void> {
  if (node.tag === '#text') return
  const matchedRules = cssRules.filter(rule => doesSelectorMatch(node, rule.selector))
  const model = await getModelByTag(node.tag)
  if (model) {
    model.position.set(x, y, z)
    scene.add(model)

    // ✨ Підпис назви тега
    const nameLabel = createLabelMesh(node.tag)
    nameLabel.position.set(x, y + 1.6, z)
    scene.add(nameLabel)

    // ✨ Підпис атрибутів
    if (node.attributes) {
      // TODO: update attr because don`t work
      const labelTexts: string[] = []
      if (node.attributes.id) labelTexts.push(`id: ${node.attributes.id}`)
      if (node.attributes.class) labelTexts.push(`class: ${node.attributes.class}`)
      if (node.attributes.style) labelTexts.push(`style: ${node.attributes.style}`)

      const labelText = labelTexts.join(' | ')
      if (labelText) {
        const attrLabel = createLabelMesh(labelText)
        attrLabel.position.set(x, y - 1.2, z)
        scene.add(attrLabel)
      }
    }
    if (matchedRules.length > 0) {
      const label = createLabelMesh(
        matchedRules.map(r => r.selector).join(', '),
        200
      )
      label.position.set(x, y + 2.5, z + 1)
      scene.add(label)
    }
    const spacing = 4
    const verticalGap = 4

    // 🔸 Особливий випадок — <html>
    if (node.tag === 'html' && node.children.length === 2) {
      const head = node.children.find(c => c.tag === 'head')
      const body = node.children.find(c => c.tag === 'body')

      if (head) {
        const headX = x - 6
        const headY = y + verticalGap
        const arrow = createArrowWithEffect(new THREE.Vector3(x, y, z), new THREE.Vector3(headX, headY, z), 0xff6600,)
        scene.add(arrow)
        await renderHtmlTree(head, scene, headX, headY, z, level + 1)
      }

      if (body) {
        const bodyX = x + 6
        const bodyY = y + verticalGap
        const arrow = createArrowWithEffect(new THREE.Vector3(x, y, z), new THREE.Vector3(bodyX, bodyY, z), 0xff6600,)
        scene.add(arrow)
        await renderHtmlTree(body, scene, bodyX, bodyY, z, level + 1)
      }

      return
    }

    // 🔸 Стандартний рендер гілок
    const totalWidth = getSubtreeWidth(node)
    let currentOffset = x - (totalWidth * spacing) / 2

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      const childWidth = getSubtreeWidth(child)

      const childX = currentOffset + (childWidth * spacing) / 2
      const childY = y + verticalGap
      const childZ = z

      const arrow = createArrowWithEffect(
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(childX, childY, childZ),
        0xff6600,
      )
      scene.add(arrow)

      await renderHtmlTree(child, scene, childX, childY, childZ, level + 1)

      currentOffset += childWidth * spacing
    }
  }

  // 🧭 Підпис рівня (лише при x === 0)
  if (x === 0) {
    const levelLabel = createLabelMesh(`LEVEL ${level}`)
    levelLabel.position.set(x - 10, y, z)
    scene.add(levelLabel)
  }
}

