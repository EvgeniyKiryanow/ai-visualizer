import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export interface SceneSetup {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
}

/**
 * Ініціалізація сцени, камери, рендерера та контролів
 */
export function setupScene(container: HTMLDivElement): SceneSetup {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x101010)

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  )
  camera.position.set(0, 20, 100)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = true
  controls.enableRotate = true
  controls.update()

  // Додаємо сітку підлоги
  const gridHelper = new THREE.GridHelper(200, 50)
  gridHelper.position.set(0, 0, 0)
  scene.add(gridHelper)

  // Додаємо прозору стінку позаду
  const wallGeometry = new THREE.BoxGeometry(200, 200, 10)
  const wallMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true
  })
  const wall = new THREE.Mesh(wallGeometry, wallMaterial)
  wall.position.set(0, 100, -100)
  scene.add(wall)

  return { scene, camera, renderer, controls }
}
