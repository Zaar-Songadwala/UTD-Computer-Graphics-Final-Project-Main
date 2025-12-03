//this is where the better camera controls will go
import * as THREE from 'three';

//use orbit controls from three.js 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function controlsInit (camera, renderer) {
    const controls = new OrbitControls(camera, renderer);
    controls.enableDamping = true;
    controls.target.set(0,0,0); //sun
    return controls;
}

export function updateCamera (controls) {
    controls.update();
}

export function changeCameraTarget(controls, {x,y,z}) {
    controls.target.set(x,y,z);
}
