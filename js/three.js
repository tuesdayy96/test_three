import * as THREE from 'three';
import {GLTFLoader} from 'GLTFLoader';
import {OrbitControls} from 'OrbitControls';


main();
function main(){
    const canvas = document.querySelector('.bg');
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(canvas.clientWidth,canvas.clientHeight);
    canvas.appendChild(renderer.domElement);


    const scene = new THREE.Scene();

    
    const fov = 75;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const near = 0.01;
    const far = 500;
    const camera = new THREE.PerspectiveCamera(fov,width/height,near,far);
    camera.position.set(0,0,5);
    scene.add(camera)


   
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshPhongMaterial({color: 0xf0ff48});
    const cube = new THREE.Mesh(geometry,material);
    scene.add(cube);

    const plo = new THREE.PlaneGeometry(5,5);
    const ploMa = new THREE.MeshBasicMaterial({color:0x00ff99});
    const plane = new THREE.Mesh(plo,ploMa);
    plane.position.y = -1;
    plane.rotation.x = Math.PI * -0.5;
    scene.add(plane);

    const light = new THREE.DirectionalLight({color:0xffffff,intensity:1});
    light.position.set(-1,2,4);
    camera.add(light);

    function render(time){
        time = 0.01;

        cube.rotation.x += time;
        cube.rotation.y += time;
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
