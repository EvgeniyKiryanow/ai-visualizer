import * as THREE from 'three'
import { NodeTree } from './htmlToJsonTree'
import { createArrowWithEffect } from './createArrow'
import { getModelByTag } from '../models/getModelsByTag'

export async function renderHtmlTree(
  node: NodeTree,
  scene: THREE.Scene,
  x: number,
  y: number,
  z: number,
  level: number = 0
): Promise<void> {
  if (node.tag === '#text') return

  const model = await getModelByTag(node.tag)
  if (model) {
    model.position.set(x, y, z)
    scene.add(model)

    const spacing = 4
    const verticalGap = 4

    // Особливий випадок для <html>: обробляємо <head> і <body> окремо
    if (node.tag === 'html' && node.children.length === 2) {
      const head = node.children.find(c => c.tag === 'head')
      const body = node.children.find(c => c.tag === 'body')

      if (head) {
        const headX = x - 6
        const headY = y + verticalGap
        const headZ = z
        const arrow = createArrowWithEffect(new THREE.Vector3(x, y, z), new THREE.Vector3(headX, headY, headZ))
        scene.add(arrow)
        await renderHtmlTree(head, scene, headX, headY, headZ, level + 1)
      }

      if (body) {
        const bodyX = x + 6
        const bodyY = y + verticalGap
        const bodyZ = z
        const arrow = createArrowWithEffect(new THREE.Vector3(x, y, z), new THREE.Vector3(bodyX, bodyY, bodyZ))
        scene.add(arrow)
        await renderHtmlTree(body, scene, bodyX, bodyY, bodyZ, level + 1)
      }

      return // зупиняємо подальшу обробку дітей — уже зробили вручну
    }

    // Звичайне дерево: кожна дитина під батьком
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]

      const childX = x + i * spacing - (spacing * (node.children.length - 1)) / 2
      const childY = y + verticalGap
      const childZ = z

      const arrow = createArrowWithEffect(
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(childX, childY, childZ)
      )
      scene.add(arrow)

      await renderHtmlTree(child, scene, childX, childY, childZ, level + 1)
    }
  }
}
