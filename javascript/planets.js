import * as THREE from 'three';

export function createBody(currScene, mass, radius, x, y, z, texture = null, options = {}) {
  var bodyTexture = null;
  if (texture != null) {
    bodyTexture = new THREE.TextureLoader().load(texture);
  }

  const bodyGeo = new THREE.SphereGeometry(radius);
  
  // Special handling for the Sun to make it glow
  const isSun = options.emissive !== undefined && options.emissive === 0xffaa33;
  
  const bodyMat = new THREE.MeshPhongMaterial({
    map: bodyTexture,
    emissiveMap: isSun ? bodyTexture : null,
    shininess: 30,
    specular: 0x444444,
    ...options
    //this will be replaced with custom shaders at some point in the future 
  })

  const body = new THREE.Mesh(bodyGeo, bodyMat);

  body.position.set(x, y, z);
  body.orbitRadius = Math.sqrt(x * x + z * z); // Distance from Sun
  body.orbitAngle = Math.atan2(z, x); // Current angle in orbit

  currScene.add(body);
  return body;

}

export function createOrbitLine(currScene, radius) {
  const orbitPoints = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    orbitPoints.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.3 });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
  
  currScene.add(orbitLine);
  return orbitLine;
}

export function createSaturnRings(currScene, saturnPlanet) {
  // Create a ring mesh with transparency
  const ringsTexture = new THREE.TextureLoader().load('assets/saturn_rings.png');
  const ringGeometry = new THREE.RingGeometry(0.45, 0.7, 64);
  const ringMaterial = new THREE.MeshPhongMaterial({
    map: ringsTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9
  });
  
  const rings = new THREE.Mesh(ringGeometry, ringMaterial);
  rings.rotation.x = Math.PI / 4; // Tilt the rings
  rings.position.copy(saturnPlanet.position);
  
  // Make the rings follow Saturn
  saturnPlanet.rings = rings;
  currScene.add(rings);
  
  return rings;
}

export function createAsteroidBelt(currScene, innerRadius = 5.0, outerRadius = 6.5, count = 500) {
  const asteroids = [];
  const geometry = new THREE.SphereGeometry(0.02, 8, 8);
  const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
  
  for (let i = 0; i < count; i++) {
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 0.5; // Small variation in height
    
    const asteroid = new THREE.Mesh(geometry, material.clone());
    asteroid.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );
    asteroid.orbitRadius = radius;
    asteroid.orbitAngle = angle;
    asteroid.speed = Math.random() * 0.0005 + 0.0002;
    
    currScene.add(asteroid);
    asteroids.push(asteroid);
  }
  
  return asteroids;
}

export function createLabel(name, position, scene) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = 'Bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(name, 128, 40);
  
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  
  sprite.position.copy(position);
  sprite.position.y += 0.4; // Offset above planet
  sprite.scale.set(1.5, 0.4, 1);
  
  scene.add(sprite);
  return sprite;
}

