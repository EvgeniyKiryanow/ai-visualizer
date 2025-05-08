import * as THREE from 'three'

export function createArrowWithEffect(
  from: THREE.Vector3,
  to: THREE.Vector3,
  color: number = 0xffffff,
  thickness: number = 0.05
): THREE.Group {
  const group = new THREE.Group()

  const direction = new THREE.Vector3().subVectors(to, from)
  const length = direction.length()
  const midPoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)

  // Лінія
  const line = new THREE.Mesh(
    new THREE.CylinderGeometry(thickness, thickness, length, 8),
    new THREE.MeshBasicMaterial({ color })
  )
  line.position.copy(midPoint)
  line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
  group.add(line)

  // Наконечник
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(thickness * 2, thickness * 4, 12),
    new THREE.MeshBasicMaterial({ color })
  )
  cone.position.copy(to)
  cone.lookAt(from)
  group.add(cone)

  // Анімована кулька (ефект "пульсації")
  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(thickness * 1.5, 8, 8),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 })
  )
  group.add(pulse)

  // Анімація glowing-точки
  const pulseSpeed = 0.02 + Math.random() * 0.01
  let t = Math.random() * Math.PI
  const update = () => {
    t += pulseSpeed
    const clamped = Math.sin(t) * 0.5 + 0.5
    const point = from.clone().lerp(to, clamped)
    pulse.position.copy(point)
    requestAnimationFrame(update)
  }
  update()

  return group
}
