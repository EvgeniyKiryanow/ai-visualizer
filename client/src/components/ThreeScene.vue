<template>
  <div>
    <NavigationPanel />
    <div ref="sceneContainer" class="scene-container" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { setupScene } from '../scenes/setupScene'
import { exampleHtml } from '../data/exampleHtml'
import { parseHtmlToTree, extractStyleBlocks, NodeTree } from '../utils/html/htmlToJsonTree'
import { extractCssRules, CssRule } from '../utils/css/extractCssRules'
import { ensureFullHtmlStructure } from '../utils/html/ensureFullHtmlStructure'
import { renderHtmlTree } from '../utils/html/renderHtmlTree'
import { createStylePanel } from '../utils/css/createStylePanel'
import { createArrowWithEffect } from '../utils/arrowd/createArrow'
import { doesSelectorMatch } from '../utils/css/doesSelectorMatch'
import { walkTree } from '../utils/structure/walkTree'
import { activeView } from '../store/uiState'
import NavigationPanel from '../components/NavigationPanel.vue'

// === GLOBALS ===
const sceneContainer = ref<HTMLDivElement | null>(null)
const nodePositionMap = new Map<NodeTree, THREE.Vector3>()
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, controls: OrbitControls

// === Рендер усього в залежності від активної вкладки
async function renderContent(view: 'html' | 'css') {
  if (!scene) return

  // 🔄 Очистити сцену перед перерендером
  while (scene.children.length > 0) {
    scene.remove(scene.children[0])
  }

  // 🎥 Декорації сцени
  scene.background = new THREE.Color(0x101010)
  scene.add(new THREE.GridHelper(200, 50))

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(200, 200, 10),
    new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
  )
  wall.position.set(0, 100, -100)
  scene.add(wall)

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(10, 20, 10)
  scene.add(light)

  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)

  // 📦 Парсимо дані
  const doc = new DOMParser().parseFromString(exampleHtml, 'text/html')
  const parsedTree = parseHtmlToTree(exampleHtml)
  const fullTree = ensureFullHtmlStructure(parsedTree)
  const styleStrings = extractStyleBlocks(doc)
  const allCssRules: CssRule[] = styleStrings.flatMap(extractCssRules)

  nodePositionMap.clear()
  fullTree.forEach(root => walkTree(root, nodePositionMap))

  // if (view === 'html') {
    for (let i = 0; i < fullTree.length; i++) {
      await renderHtmlTree(fullTree[i], scene, i * 5, 1, 0, 0, allCssRules)
    }
  // }

  // TODO: update logic for css and html
  // if (view === 'css') {
    for (const rule of allCssRules) {
      const text = `${rule.selector} {\n  ${Object.entries(rule.declarations)
        .map(([k, v]) => `${k}: ${v}`)
        .join(';\n  ')}\n}`

      for (const [node, pos] of nodePositionMap.entries()) {
        if (doesSelectorMatch(node, rule.selector)) {
          const panelOffset = new THREE.Vector3(2.5, 0, -1.5)
          const panelPos = pos.clone().add(panelOffset)

          const panel = createStylePanel(text, panelPos)
          scene.add(panel)

          const arrow = createArrowWithEffect(panelPos, pos.clone(), 0x00ccff, 0.04)
          scene.add(arrow)
        }
      }
    }
  // }
}

// === ON MOUNT ===
onMounted(async () => {
  if (!sceneContainer.value) return
  const setup = setupScene(sceneContainer.value)
  scene = setup.scene
  camera = setup.camera
  renderer = setup.renderer
  controls = setup.controls

  await renderContent(activeView.value)

  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
})

// === ON VIEW SWITCH ===
watch(activeView, async (newVal) => {
  await renderContent(newVal)
})
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  background-color: #f0f0f0;
}
</style>
