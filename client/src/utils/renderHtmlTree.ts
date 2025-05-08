import * as THREE from 'three'
import { NodeTree } from './htmlToJsonTree'
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

    if (level > 0) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, y + 2, z),
        new THREE.Vector3(x, y, z),
      ])
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
      const line = new THREE.Line(lineGeometry, lineMaterial)
      scene.add(line)
    }

    const spacing = 3
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      await renderHtmlTree(
        child,
        scene,
        x + i * spacing - (spacing * (node.children.length - 1)) / 2,
        y + 3,
        z,
        level + 1
      )
    }
  }
}
