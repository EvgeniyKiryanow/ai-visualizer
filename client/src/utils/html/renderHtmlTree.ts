import * as THREE from 'three'
import { NodeTree } from './htmlToJsonTree'
import { createArrowWithEffect } from '../arrowd/createArrow'
import { getModelByTag } from '../../models/getModelsByTag'
import { createLabelMesh } from '../labels/threeLabel'
import { CssRule } from '../css/extractCssRules'
import { doesSelectorMatch } from '../css/doesSelectorMatch'

function getSubtreeWidth(node: NodeTree): number {
  if (!node.children || node.children.length === 0) return 1
  return node.children.reduce((sum, child) => sum + getSubtreeWidth(child), 0)
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
  if (!model) return

  model.position.set(x, y, z)
  scene.add(model)

  // 🏷 Назва тега
  const nameLabel = createLabelMesh(node.tag)
  nameLabel.position.set(x, y + 1.6, z)
  scene.add(nameLabel)

  // 🏷 Атрибути
  if (node.attributes) {
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

  // 🧩 Показ CSS-правил, які застосовано
  if (matchedRules.length > 0) {
    const label = createLabelMesh(
      matchedRules.map(r => r.selector).join(', '),
      200
    )
    label.position.set(x, y + 2.5, z)
    scene.add(label)
  }

  const spacing = 4
  const verticalGap = 4

  // 🌐 Обробка <html> окремо
  if (node.tag === 'html' && node.children.length === 2) {
    const head = node.children.find(c => c.tag === 'head')
    const body = node.children.find(c => c.tag === 'body')

    if (head) {
      const headX = x - 6
      const headY = y + verticalGap
      const arrow = createArrowWithEffect(
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(headX, headY, z),
        0xffffff
      )
      scene.add(arrow)
      await renderHtmlTree(head, scene, headX, headY, z, level + 1, cssRules)
    }

    if (body) {
      const bodyX = x + 6
      const bodyY = y + verticalGap
      const arrow = createArrowWithEffect(
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(bodyX, bodyY, z),
        0xffffff
      )
      scene.add(arrow)
      await renderHtmlTree(body, scene, bodyX, bodyY, z, level + 1, cssRules)
    }

    return
  }

  // 🌱 Рендер дітей
  const totalWidth = getSubtreeWidth(node)
  let currentOffset = x - (totalWidth * spacing) / 2

  for (const child of node.children) {
    const childWidth = getSubtreeWidth(child)

    const childX = currentOffset + (childWidth * spacing) / 2
    const childY = y + verticalGap

    const from = new THREE.Vector3(x, y, z)
    const to = new THREE.Vector3(childX, childY, z)

    const arrow = createArrowWithEffect(from, to, 0xffffff)
    scene.add(arrow)

    await renderHtmlTree(child, scene, childX, childY, z, level + 1, cssRules)

    currentOffset += childWidth * spacing
  }

  // 🧭 Підпис рівня
  if (x === 0) {
    const levelLabel = createLabelMesh(`LEVEL ${level}`)
    levelLabel.position.set(x - 10, y, z)
    scene.add(levelLabel)
  }
}
