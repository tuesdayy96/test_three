import * as THREE from 'three';
import {GLTFLoader} from 'GLTFLoader';
import {OrbitControls} from 'OrbitControls';

main();
function main(){
    const canvas = document.querySelector('.bg');
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(canvas.clientWidth,canvas.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    canvas.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const fov = 45;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,width/height,near,far);
    camera.position.set(0,0,300);
    scene.add(camera)

    const loader = new GLTFLoader();
    loader.load('./data/Shark.gltf',(gltf)=>{
        const model = gltf.scene;
        scene.add(model);
    })

    const light = new THREE.DirectionalLight({color:0xffffff,intensity:1});
    light.position.set(1,1,1);
    camera.add(light);

    function render(time){
        renderer.render(scene,camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);


    window.onresize = function(){
        const canvas = document.querySelector('.bg');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width,height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
    }

    const control = new OrbitControls(camera,renderer.domElement);
}