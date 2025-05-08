<template>
  <div>
    <div ref="sceneContainer" class="scene-container" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { parseHtmlToTree, extractStyleBlocks } from "../utils/htmlToJsonTree";
import { extractCssRules, CssRule } from "../utils/extractCssRules";
import { renderHtmlTree } from "../utils/renderHtmlTree";
import { ensureFullHtmlStructure } from "../utils/ensureFullHtmlStructure";
import { createStylePanel } from "../utils/createStylePanel";
import { createArrowWithEffect } from "../utils/createArrow";
import { exampleHtml } from "../data/exampleHtml";
import { NodeTree } from "../utils/htmlToJsonTree";

// 🔄 Сцена, камера, рендер
const sceneContainer = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls;

// 🔁 Обхід усіх вузлів дерева
function walkTree(
  node: NodeTree,
  callback: (node: NodeTree, pos: THREE.Vector3) => void,
  x = 0,
  y = 0,
  z = 0,
  spacing = 4,
  verticalGap = 4
) {
  callback(node, new THREE.Vector3(x, y, z));

  const totalWidth = node.children?.length || 0;
  let offset = x - (totalWidth * spacing) / 2;

  for (const child of node.children || []) {
    const childX = offset + spacing / 2;
    const childY = y + verticalGap;
    walkTree(child, callback, childX, childY, z);
    offset += spacing;
  }
}

// 🔍 Порівняння селектора з вузлом
function doesSelectorMatch(node: NodeTree, selector: string): boolean {
  if (selector.startsWith(".")) {
    return (
      node.attributes?.class?.split(" ").includes(selector.slice(1)) ?? false
    );
  }
  if (selector.startsWith("#")) {
    return node.attributes?.id === selector.slice(1);
  }
  return node.tag === selector;
}

// 📦 onMounted
onMounted(async () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });

  if (!sceneContainer.value) return;
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneContainer.value.appendChild(renderer.domElement);

  scene.background = new THREE.Color(0x101010);

  const gridHelper = new THREE.GridHelper(200, 50);
  gridHelper.position.set(0, 0, 0);
  scene.add(gridHelper);

  const wallGeometry = new THREE.BoxGeometry(200, 200, 10);
  const wallMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true,
  });
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(0, 100, -100);
  scene.add(wall);

  camera.position.set(0, 20, 100);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enableRotate = true;
  controls.update();

  // 🔎 Парсимо HTML + CSS
  const doc = new DOMParser().parseFromString(exampleHtml, "text/html");
  const parsedTree = parseHtmlToTree(exampleHtml);
  const fullTree = ensureFullHtmlStructure(parsedTree);
  const styleStrings = extractStyleBlocks(doc);
  const allCssRules: CssRule[] = styleStrings.flatMap(extractCssRules);

  // 🔁 Рендер HTML дерева
  for (let i = 0; i < fullTree.length; i++) {
    await renderHtmlTree(fullTree[i], scene, i * 5, 1, 0, 0, allCssRules);
  }

  // ✨ Рендер стилів і стрілок
  // ✨ Рендер стилів і стрілок
  allCssRules.forEach((rule, index) => {
    const text = `${rule.selector} {\n  ${Object.entries(rule.declarations)
      .map(([k, v]) => `${k}: ${v}`)
      .join(";\n  ")}\n}`;

    fullTree.forEach((root) => {
      walkTree(root, (node, pos) => {
        if (doesSelectorMatch(node, rule.selector)) {
          const offset = new THREE.Vector3(0, 0, -2);
          const panelPos = pos.clone().add(offset);

          const panel = createStylePanel(text, panelPos);
          scene.add(panel);

          const targetPos = pos.clone().add(new THREE.Vector3(-3, 1, 0)) // Центр HTML-блоку
          const arrow = createArrowWithEffect(panelPos, targetPos, 0x00ccff, 0.04)
          scene.add(arrow);
        }
      });
    });
  });

  // 🔄 Анімація
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };

  animate();
});
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
