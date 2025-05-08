<template>
  <div>
    <h1>3D Tree Visualization</h1>
    <div ref="sceneContainer" class="scene-container" />
    <div class="controls">
      <button @click="rotateCamera(-10)">Rotate Left</button>
      <button @click="rotateCamera(10)">Rotate Right</button>
      <button @click="zoomIn">Zoom In</button>
      <button @click="zoomOut">Zoom Out</button>
      <button @click="moveUp">Move Up</button>
      <button @click="moveDown">Move Down</button>
      <button @click="moveLeft">Move Left</button>
      <button @click="moveRight">Move Right</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { parseHtmlToTree } from '../utils/htmlToJsonTree'
import { renderHtmlTree } from "../utils/renderHtmlTree"
import { ensureFullHtmlStructure } from '../utils/ensureFullHtmlStructure'

const sceneContainer = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls

onMounted(async () => {
  // Сцена, камера, рендер
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
  renderer = new THREE.WebGLRenderer({ antialias: true })

  if (!sceneContainer.value) return
  renderer.setSize(window.innerWidth, window.innerHeight)
  sceneContainer.value.appendChild(renderer.domElement)

  // Фон, сітка, стіна
  scene.background = new THREE.Color(0x101010)
  const gridHelper = new THREE.GridHelper(200, 50)
  gridHelper.position.set(0, 0, 0)
  scene.add(gridHelper)

  const wallGeometry = new THREE.BoxGeometry(200, 200, 10)
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
  const wall = new THREE.Mesh(wallGeometry, wallMaterial)
  wall.position.set(0, 100, -100)
  scene.add(wall)

  // Контрол
  camera.position.set(0, 20, 100)
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = true
  controls.enableRotate = true
  controls.update()

  // HTML дерево
  const html = '<div><p></p> <p></p> <p></p></div>'
  const parsedTree = parseHtmlToTree(html)
const fullTree = ensureFullHtmlStructure(parsedTree)

  // Додати всі кореневі елементи дерева
for (let i = 0; i < fullTree.length; i++) {
  const rootNode = fullTree[i]
  await renderHtmlTree(rootNode, scene, i * 5, 1, 0)
}

  // Анімація
  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }

  animate()
})

// Кнопки управління камерою
const rotateCamera = (angle: number) => {
  camera.rotation.y += THREE.MathUtils.degToRad(angle)
}
const zoomIn = () => (camera.position.z -= 5)
const zoomOut = () => (camera.position.z += 5)
const moveUp = () => (camera.position.y += 5)
const moveDown = () => (camera.position.y -= 5)
const moveLeft = () => (camera.position.x -= 5)
const moveRight = () => (camera.position.x += 5)

</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  background-color: #f0f0f0;
}

.controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: white;
  padding: 10px;
  border-radius: 5px;
}

button {
  margin: 5px;
}
</style>
