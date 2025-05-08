// utils/render/renderLabels.ts
import * as THREE from 'three'
import { NodeTree } from '../htmlToJsonTree'
import { createLabelMesh } from '../../labels/threeLabel'

export function renderLabels(node: NodeTree, position: THREE.Vector3, scene: THREE.Scene, level: number, matchedSelectors: string[]) {
  // Назва тегу
  const tagLabel = createLabelMesh(node.tag)
  tagLabel.position.set(position.x, position.y + 1.6, position.z)
  scene.add(tagLabel)

  // Атрибути
  if (node.attributes) {
    const texts: string[] = []
    if (node.attributes.id) texts.push(`id: ${node.attributes.id}`)
    if (node.attributes.class) texts.push(`class: ${node.attributes.class}`)
    if (node.attributes.style) texts.push(`style: ${node.attributes.style}`)
    const attrText = texts.join(' | ')
    if (attrText) {
      const attrLabel = createLabelMesh(attrText)
      attrLabel.position.set(position.x, position.y - 1.2, position.z)
      scene.add(attrLabel)
    }
  }

  // CSS селектори
  if (matchedSelectors.length > 0) {
    const selectorLabel = createLabelMesh(matchedSelectors.join(', '))
    selectorLabel.position.set(position.x, position.y + 2.5, position.z)
    scene.add(selectorLabel)
  }

  // LEVEL
  if (position.x === 0) {
    const levelLabel = createLabelMesh(`LEVEL ${level}`)
    levelLabel.position.set(position.x - 10, position.y, position.z)
    scene.add(levelLabel)
  }
}
