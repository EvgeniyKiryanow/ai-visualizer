import * as THREE from 'three'

export function createStylePanel(text: string, position: THREE.Vector3): THREE.Mesh {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#001a33' // темно-синій фон
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#00ccff'
  ctx.font = '16px Courier New'

  const lines = text.split('\n')
  lines.forEach((line, i) => {
    ctx.fillText(line, 10, 25 + i * 18)
  })

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true })
  const geometry = new THREE.PlaneGeometry(4, 2) // ❗ Мала панель

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.copy(position)
  return mesh
}
