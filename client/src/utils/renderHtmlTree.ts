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
  console.log('Rendering tag:', node.tag)

  if (node.tag === '#text') return

  const model = await getModelByTag(node.tag)
  if (model) {
    model.position.set(x, y, z)
    scene.add(model)

    const spacing = 3

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]

      // Обчислюємо позицію дитини
      const childX = x + i * spacing - (spacing * (node.children.length - 1)) / 2
      const childY = y + 3
      const childZ = z

      // Додаємо стрілку між батьком і дитиною
      const arrow = createArrowWithEffect(
        new THREE.Vector3(x, y + 1, z),
        new THREE.Vector3(childX, childY, childZ)
      )
      scene.add(arrow)

      // Рекурсивно додаємо дитину
      await renderHtmlTree(child, scene, childX, childY, childZ, level + 1)
    }
  }
}
