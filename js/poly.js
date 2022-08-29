import * as THREE from 'three';
import {GLTFLoader} from 'GLTFLoader';
import {OrbitControls} from 'OrbitControls';

let a;
main();
function main(){
    const canvas = document.querySelector('.bg');
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(canvas.clientWidth,canvas.clientHeight);
    canvas.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfffff);

    
}