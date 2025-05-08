import * as THREE from 'three'
import { NodeTree } from '../html/htmlToJsonTree'

/**
 * Обхід дерева HTML та обрахунок позицій кожного елемента
 * @param node — поточний вузол дерева
 * @param map — Map для зберігання позицій
 * @param x — початкова позиція по X
 * @param y — початкова позиція по Y
 * @param z — початкова позиція по Z
 * @param spacing — відстань між братніми елементами
 * @param verticalGap — відстань між рівнями дерева
 */
export function walkTree(
  node: NodeTree,
  map: Map<NodeTree, THREE.Vector3>,
  x = 0,
  y = 0,
  z = 0,
  spacing = 4,
  verticalGap = 4
): void {
  const pos = new THREE.Vector3(x, y, z)
  map.set(node, pos)

  const totalChildren = node.children?.length || 0
  let offset = x - (totalChildren * spacing) / 2

  for (const child of node.children || []) {
    const childX = offset + spacing / 2
    const childY = y + verticalGap
    walkTree(child, map, childX, childY, z, spacing, verticalGap)
    offset += spacing
  }
}
