// utils/render/renderContainerBox.ts
import * as THREE from 'three'
import { createLabelMesh } from '../../labels/threeLabel'

export function renderContainerBox(
  scene: THREE.Scene,
  position: THREE.Vector3,
  size: { x: number; y: number; z: number },
  label: string,
  color: number = 0x888888
) {
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
  const material = new THREE.MeshBasicMaterial({
    color,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  })
  const box = new THREE.Mesh(geometry, material)
  box.position.copy(position)
  scene.add(box)

  const labelMesh = createLabelMesh(label)
  labelMesh.position.set(position.x, position.y + size.y / 2 + 1, position.z)
  scene.add(labelMesh)
}
