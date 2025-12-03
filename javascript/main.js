import * as THREE from 'three';
import * as Planets from './planets.js';
import * as CameraControls from './cameraControls.js';

function main() {
  //let's just get a sphere on screen
  //NOTE: may be a good idea to give objects their own files

  //simple camera
  const cameraAttributes = {
    fov: 80,
    aspectRatio: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000
  }

  const camera = new THREE.PerspectiveCamera(cameraAttributes.fov, cameraAttributes.aspectRatio, cameraAttributes.near, cameraAttributes.far);
  const scene = new THREE.Scene();


  const bg = new THREE.TextureLoader().load('assets/8k_stars_milky_way.jpg');
  scene.background = bg;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  camera.position.z = 8;

  const controls = CameraControls.controlsInit(camera, renderer.domElement);

  //create some planets
  const planets = [];

  const sun = Planets.createBody(scene, 5, 0.8, 0, 0, 0, 'assets/sun.jpg', {
    emissive: 0xffaa33,
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 1
  })
  planets.push(sun);

  

  const mercury = Planets.createBody(scene, 5, 0.038, 1.5, 0, 0, 'assets/mercury.jpg');
  planets.push(mercury);

  const venus = Planets.createBody(scene, 5, 0.095, 2.2, 0, 0, 'assets/venus.jpg');
  planets.push(venus);

  const earth = Planets.createBody(scene, 5, 0.1, 3.0, 0, 0, 'assets/8k_earth_daymap.jpg');
  planets.push(earth);
  
  // Add Earth's Moon
  const moon = Planets.createBody(scene, 0.1, 0.037, 3.25, 0, 0, 'assets/moon.jpg');
  moon.earthOrbit = { radius: 0.35, angle: 0, speed: 0.1 };
  planets.push(moon);

  const mars = Planets.createBody(scene, 5, 0.053, 3.8, 0, 0, 'assets/mars6ksurface.jpg');
  planets.push(mars);

  // Create asteroid belt between Mars and Jupiter
  const asteroids = Planets.createAsteroidBelt(scene, 5.0, 6.5, 500);

  const jupiter = Planets.createBody(scene, 5, 0.35, 7.5, 0, 0, 'assets/jupiter.jpg');
  planets.push(jupiter);

  const saturn = Planets.createBody(scene, 5, 0.30, 12.0, 0, 0, 'assets/saturn.jpg');
  planets.push(saturn);
  
  // Add Saturn's rings
  Planets.createSaturnRings(scene, saturn);

  const uranus = Planets.createBody(scene, 5, 0.15, 18.0, 0, 0, 'assets/uranus.jpg');
  planets.push(uranus);

  const neptune = Planets.createBody(scene, 5, 0.14, 24.0, 0, 0, 'assets/neptune.jpg');
  planets.push(neptune);

  // Add labels for all planets
  const sunLabel = Planets.createLabel('Sun', sun.position, scene);
  const mercuryLabel = Planets.createLabel('Mercury', mercury.position, scene);
  const venusLabel = Planets.createLabel('Venus', venus.position, scene);
  const earthLabel = Planets.createLabel('Earth', earth.position, scene);
  const moonLabel = Planets.createLabel('Moon', moon.position, scene);
  const marsLabel = Planets.createLabel('Mars', mars.position, scene);
  const jupiterLabel = Planets.createLabel('Jupiter', jupiter.position, scene);
  const saturnLabel = Planets.createLabel('Saturn', saturn.position, scene);
  const uranusLabel = Planets.createLabel('Uranus', uranus.position, scene);
  const neptuneLabel = Planets.createLabel('Neptune', neptune.position, scene);
  
  // Track planet-label pairs for updating positions
  const planetLabels = [
    { planet: sun, label: sunLabel },
    { planet: mercury, label: mercuryLabel },
    { planet: venus, label: venusLabel },
    { planet: earth, label: earthLabel },
    { planet: moon, label: moonLabel },
    { planet: mars, label: marsLabel },
    { planet: jupiter, label: jupiterLabel },
    { planet: saturn, label: saturnLabel },
    { planet: uranus, label: uranusLabel },
    { planet: neptune, label: neptuneLabel }
  ];
  Planets.createOrbitLine(scene, mercury.orbitRadius);
  Planets.createOrbitLine(scene, venus.orbitRadius);
  Planets.createOrbitLine(scene, earth.orbitRadius);
  Planets.createOrbitLine(scene, mars.orbitRadius);
  Planets.createOrbitLine(scene, jupiter.orbitRadius);
  Planets.createOrbitLine(scene, saturn.orbitRadius);
  Planets.createOrbitLine(scene, uranus.orbitRadius);
  Planets.createOrbitLine(scene, neptune.orbitRadius);

  // Define orbital speeds (inner planets faster, outer planets slower)
  const orbitalSpeeds = {
    mercury: 0.04,
    venus: 0.015,
    earth: 0.01,
    mars: 0.008,
    jupiter: 0.002,
    saturn: 0.0009,
    uranus: 0.0004,
    neptune: 0.0001
  };

  mercury.speed = orbitalSpeeds.mercury;
  venus.speed = orbitalSpeeds.venus;
  earth.speed = orbitalSpeeds.earth;
  mars.speed = orbitalSpeeds.mars;
  jupiter.speed = orbitalSpeeds.jupiter;
  saturn.speed = orbitalSpeeds.saturn;
  uranus.speed = orbitalSpeeds.uranus;
  neptune.speed = orbitalSpeeds.neptune;


  //handle mouse clicking on planets
  window.addEventListener('mousedown', onMouseDown);
  function onMouseDown(event) {
    //calculate mouse position in normalized device coordinates
    //(-1 to +1) for both components
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planets);
    if (intersects.length > 0) {
      console.log("Clicked on planet at position: ", intersects[0].object.position);
      CameraControls.changeCameraTarget(controls, intersects[0].object.position);
    }
  }

  // Sun as primary light source
  const sunLight = new THREE.PointLight(0xffffff, 2.5, 100);
  sunLight.position.set(0, 0, 0);  // Fixed at Sun's center
  scene.add(sunLight);
  
  // Gentle ambient light for night-side visibility
  scene.add(new THREE.AmbientLight(0xffffff, 0.15));




  function animate() {
    // Rotate planets on their axes
    sun.rotation.y += .002;
    earth.rotation.y += .002;
    mars.rotation.y += .002;
    jupiter.rotation.y += .001;
    saturn.rotation.y += .001;

    // Orbital motion for all planets except Sun
    [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune].forEach(planet => {
      if (planet.speed) {
        planet.orbitAngle += planet.speed;
        planet.position.x = Math.cos(planet.orbitAngle) * planet.orbitRadius;
        planet.position.z = Math.sin(planet.orbitAngle) * planet.orbitRadius;
      }
      
      // Update rings if they exist (Saturn)
      if (planet.rings) {
        planet.rings.position.copy(planet.position);
      }
    });

    // Moon orbits Earth
    if (moon.earthOrbit) {
      moon.earthOrbit.angle += moon.earthOrbit.speed;
      moon.position.x = earth.position.x + Math.cos(moon.earthOrbit.angle) * moon.earthOrbit.radius;
      moon.position.z = earth.position.z + Math.sin(moon.earthOrbit.angle) * moon.earthOrbit.radius;
    }

    // Move asteroids
    asteroids.forEach(asteroid => {
      asteroid.orbitAngle += asteroid.speed;
      asteroid.position.x = Math.cos(asteroid.orbitAngle) * asteroid.orbitRadius;
      asteroid.position.z = Math.sin(asteroid.orbitAngle) * asteroid.orbitRadius;
    });

    // Update label positions
    planetLabels.forEach(({ planet, label }) => {
      label.position.copy(planet.position);
      label.position.y += 0.4;
    });

    CameraControls.updateCamera(controls);
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}

main();
