import * as THREE from 'three';
import {  createLabelMesh } from '../../utils/threeLabel' 

export function createCanvasModel() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xe34c26, transparent: true, opacity: 0.8 });
  const mesh = new THREE.Mesh(geometry, material);
  const label =  createLabelMesh('canvas');
  label.position.set(0, 1.2, 0);
  mesh.add(label);
  return mesh;
}
