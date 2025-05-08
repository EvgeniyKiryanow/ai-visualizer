import * as THREE from 'three'

export function createArrowWithEffect(from: THREE.Vector3, to: THREE.Vector3): THREE.Group {
  const group = new THREE.Group()

  // Напрямок і довжина
  const direction = new THREE.Vector3().subVectors(to, from)
  const length = direction.length()
  const midPoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)

  // Лінія
  const line = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, length, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  )
  line.position.copy(midPoint)
  line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
  group.add(line)

  // Наконечник
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.3, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  )
  cone.position.copy(to)
  cone.lookAt(from)
  group.add(cone)

  // Анімована кулька
  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
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
