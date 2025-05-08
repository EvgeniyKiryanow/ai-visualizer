import * as THREE from 'three';
import {  createLabelMesh } from '../../utils/threeLabel' 

export function createAModel() {
  const geometry = new THREE.TorusGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xe34c26, transparent: true, opacity: 0.8 });
  const mesh = new THREE.Mesh(geometry, material);
  const label =  createLabelMesh('a');
  label.position.set(0, 1.2, 0);
  mesh.add(label);
  return mesh;
}
