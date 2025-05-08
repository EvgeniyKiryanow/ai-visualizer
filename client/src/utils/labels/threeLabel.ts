import * as THREE from 'three'

export function createLabelMesh(text: string, size = 256): THREE.Mesh {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size / 4
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px Arial'
  ctx.fillText(text, 10, canvas.height / 2 + 8)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  })
  const geometry = new THREE.PlaneGeometry(3.2, 0.8)
  const mesh = new THREE.Mesh(geometry, material)

  // Горизонтально перед фігурою
  mesh.rotation.y = 0
  return mesh
}
