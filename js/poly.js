import * as THREE from 'three';
import {GLTFLoader} from 'GLTFLoader';
// import {OrbitControls} from 'OrbitControls';

let mixer,model;
main();
function main(){
    const canvas = document.querySelector('.bg');
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(canvas.clientWidth,canvas.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    canvas.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x313131);
    scene.fog = new THREE.FogExp2(0x313131, 0.001)

    const fov = 45;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,width/height,near,far);
    // camera.position.set(10,0,10);
    scene.add(camera)

    const loader = new GLTFLoader();
    loader.load('./data/tvs.glb',(gltf)=>{
        model = gltf.scene;
        scene.add(model);

        zoomAuto(model, camera);

        mixer = new THREE.AnimationMixer(model)
        const clips = gltf.animations;
        console.log(mixer);
        const clip = THREE.AnimationClip.findByName(clips, 'Scene');
        const action = mixer.clipAction(clip)
        action.play()
    })

    const light = new THREE.DirectionalLight({color:0xffffff,intensity:1});
    light.position.set(-1,2,4);
    camera.add(light);

    window.addEventListener('click',function(){
        console.log(camera.position)
        gsap.to(camera.position, {
            z:-900,
            // onUpdate: function() {
              
            // }
        })
    })
    window.addEventListener('dblclick', function(){
        gsap.to(camera.position, {
            x: -430,
            y: 261,
            z: -764
        })
    })

    const clock = new THREE.Clock()
    function render(time){
        
        renderer.render(scene,camera);
        requestAnimationFrame(render);

        if(mixer) {
            mixer.update(clock.getDelta())
        }
    }
    requestAnimationFrame(render);

    function zoomAuto(gltf, camera) {
        const box = new THREE.Box3().setFromObject(gltf);
        const sizeBox = box.getSize(new THREE.Vector3()).length();
        const centerBox = box.getCenter(new THREE.Vector3());
        const halfSizeModel = sizeBox * 0.5;
        const halffov = THREE.MathUtils.degToRad(camera.fov * 0.5);
        const distance = halfSizeModel / Math.tan(halffov);
    
        const direction = (new THREE.Vector3()).subVectors(camera.position, centerBox).multiply(new THREE.Vector3(3,0,13)).normalize();
    
        const position = direction.multiplyScalar(distance).add(centerBox);
        camera.position.copy(position);
        camera.near = sizeBox / 100;
        camera.far = sizeBox * 100;
        camera.updateProjectionMatrix();
        camera.lookAt(centerBox.x, centerBox.y, centerBox.z)
    }

    window.onresize = function(){
        const canvas = document.querySelector('.bg');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width,height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
    }

    // const control = new OrbitControls(camera,renderer.domElement);
}