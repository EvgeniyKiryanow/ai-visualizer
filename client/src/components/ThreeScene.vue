<template>
  <div>
    <div ref="sceneContainer" class="scene-container" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { setupScene } from '../scenes/setupScene'
import { walkTree } from '../utils/structure/walkTree'
import { doesSelectorMatch } from '../utils/css/doesSelectorMatch'
import { exampleHtml } from '../data/exampleHtml'
import { parseHtmlToTree, extractStyleBlocks, NodeTree } from '../utils/html/htmlToJsonTree'
import { extractCssRules, CssRule } from '../utils/css/extractCssRules'
import { ensureFullHtmlStructure } from '../utils/html/ensureFullHtmlStructure'
import { renderHtmlTree } from '../utils/html/renderHtmlTree'
import { createStylePanel } from '../utils/css/createStylePanel'
import { createArrowWithEffect } from '../utils/arrowd/createArrow'

// === GLOBALS ===
const sceneContainer = ref<HTMLDivElement | null>(null)
const nodePositionMap = new Map<NodeTree, THREE.Vector3>()

onMounted(async () => {
  if (!sceneContainer.value) return

  const { scene, camera, renderer, controls } = setupScene(sceneContainer.value)

  // 🔎 Парсимо HTML + CSS
  const doc = new DOMParser().parseFromString(exampleHtml, 'text/html')
  const parsedTree = parseHtmlToTree(exampleHtml)
  const fullTree = ensureFullHtmlStructure(parsedTree)
  const styleStrings = extractStyleBlocks(doc)
  const allCssRules: CssRule[] = styleStrings.flatMap(extractCssRules)

  // 🧮 Розрахунок позицій вузлів
  fullTree.forEach(root => walkTree(root, nodePositionMap))

  // 🧱 Візуалізація дерева
  for (let i = 0; i < fullTree.length; i++) {
    await renderHtmlTree(fullTree[i], scene, i * 5, 1, 0, 0, allCssRules)
  }

  // 🎯 Рендер CSS блоків і стрілок
  for (const rule of allCssRules) {
    const text = `${rule.selector} {\n  ${Object.entries(rule.declarations)
      .map(([k, v]) => `${k}: ${v}`)
      .join(';\n  ')}\n}`

    for (const [node, pos] of nodePositionMap.entries()) {
      if (doesSelectorMatch(node, rule.selector)) {
        const panelOffset = new THREE.Vector3(2.5, 0, 0)
        const panelPos = pos.clone().add(panelOffset)

        const panel = createStylePanel(text, panelPos)
        scene.add(panel)

        const arrow = createArrowWithEffect(panelPos, pos.clone(), 0x00ccff, 0.04)
        scene.add(arrow)
      }
    }
  }

  // 🔁 Анімація
  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }

  animate()
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
