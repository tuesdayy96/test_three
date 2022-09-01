import * as THREE from 'three';
import {OrbitControls} from 'OrbitControls';


main();
function main(){
    const canvas = document.querySelector('.background');
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(canvas.clientWidth,canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    canvas.appendChild(renderer.domElement);


    const scene = new THREE.Scene();

    
    const fov = 75;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const near = 0.01;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,width/height,near,far);
    camera.position.set(0,5,10);
    scene.add(camera)

    const control = new OrbitControls(camera,renderer.domElement);

    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMate = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.5,
        metalness: 0.3,
        side: THREE.DoubleSide
    })
    const plane = new THREE.Mesh(planeGeo, planeMate);
    plane.rotation.x = THREE.MathUtils.degToRad(-90);
    plane.receiveShadow = true;
    scene.add(plane)

    const sphereGeo = new THREE.SphereGeometry(1, 64, 64, 0, Math.PI)
    const sphereMate = new THREE.MeshStandardMaterial({
        color: '#e68405',
        roughness: 0.1,
        metalness: 0.2
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMate);
    sphere.rotation.x = THREE.MathUtils.degToRad(-90);
    sphere.castShadow = true;
    sphere.receiveShadow = true
    scene.add(sphere)

    const torusGeo = new THREE.TorusGeometry(0.4, 0.1, 64, 64);
    const torusMate = new THREE.MeshStandardMaterial({
        color: '#ff9999',
        roughness: 0.5,
        metalness: 0.8
    })
    for(let i=0; i < 8; i++){
        const torusPivot = new THREE.Object3D();
        const torus = new THREE.Mesh(torusGeo, torusMate);
        torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
        torus.position.set(3.5, 0.5, 0)
        torusPivot.add(torus)
        torus.castShadow = true;
        torus.receiveShadow = true
        scene.add(torusPivot)
    }

    const smallSphereGeo = new THREE.SphereGeometry(0.3, 64, 64)
    const smallSphereMate = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.5,
        metalness: 0.3
    })
    const smallSpherePivot = new THREE.Object3D();
    const smallSphere = new THREE.Mesh(smallSphereGeo, smallSphereMate);
    smallSphere.position.set(3.5, 0.5, 0);
    smallSpherePivot.add(smallSphere);
    smallSphere.castShadow = true;
    smallSphere.receiveShadow = true
    smallSpherePivot.name = 'smallPivot';
    scene.add(smallSpherePivot);

    const light = new THREE.DirectionalLight({color:0xffffff,intensity: 0.5});
    light.position.set(0,5,0);
    light.target.position.set(0,0,0);
    scene.add(light);
    scene.add(light.target)
    light.castShadow = true;
    light.shadow.mapSize.width = light.shadow.mapSize.height = 2048;
    light.shadow.camera.scale.set(1.3, 1.3, 1.3)
    // light.shadow.camera.top = light.shadow.camera.right = 6;
    // light.shadow.camera.bottom = light.shadow.camera.left = -6;

    function render(time){
        time *= 0.001;
        renderer.render(scene,camera);
        control.update();
        requestAnimationFrame(render);

        const smallPivot = scene.getObjectByName('smallPivot');
        if(smallPivot){
            smallPivot.rotation.y = THREE.MathUtils.degToRad(time*50);
            const chasePivot = smallPivot.children[0]
            chasePivot.getWorldPosition(light.target.position)
        }
    }
    render();

    window.onresize = function(){
        const canvas = document.querySelector('.bg');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width,height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
    }

   
}
