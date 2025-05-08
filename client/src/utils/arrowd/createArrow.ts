import * as THREE from 'three'

export function createArrowWithEffect(from: THREE.Vector3, to: THREE.Vector3, color = 0xffffff, radius = 0.05): THREE.Group {
  const group = new THREE.Group()

  const direction = new THREE.Vector3().subVectors(to, from)
  const length = direction.length()
  const midPoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)

  const line = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 8),
    new THREE.MeshBasicMaterial({ color })
  )
  line.position.copy(midPoint)
  line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
  group.add(line)

  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(radius * 2, radius * 4, 12),
    new THREE.MeshBasicMaterial({ color })
  )
  cone.position.copy(to)
  cone.lookAt(from)
  group.add(cone)

  // 🔶 Помаранче Pulse — завжди!
  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.5, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
  )
  group.add(pulse)

  let t = Math.random() * Math.PI
  const pulseSpeed = 0.02 + Math.random() * 0.01
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
