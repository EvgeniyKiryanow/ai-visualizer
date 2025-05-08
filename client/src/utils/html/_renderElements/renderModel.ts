// utils/render/renderModel.ts
import * as THREE from 'three'
import { NodeTree } from '../htmlToJsonTree'
import { getModelByTag } from '../../../models/getModelsByTag'

// renderModel.ts
export async function renderModel(node: NodeTree, position: THREE.Vector3, scene: THREE.Scene): Promise<THREE.Object3D | null> {
  const model = await getModelByTag(node.tag)
  if (!model) return null

  model.position.copy(position)
  scene.add(model)
  return model
}

