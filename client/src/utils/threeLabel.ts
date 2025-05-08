import * as THREE from 'three'

export function createLabelMesh(text: string): THREE.Mesh {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#ffffff'
  ctx.font = '28px Arial'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 10, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  })
  const geometry = new THREE.PlaneGeometry(2.5, 0.6)
  const mesh = new THREE.Mesh(geometry, material)

  // Розміщуємо передньою стороною (на +Z)
  mesh.position.set(0, 0.5, 0.55) // трошки над центром і вперед
  mesh.rotation.y = 0 // дивиться вперед

  return mesh
}
