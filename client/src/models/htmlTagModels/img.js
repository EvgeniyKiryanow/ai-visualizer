// Model for <img> tag
import * as THREE from 'three';

export function createImgModel() {
  const geometry = new THREE.PlaneGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
