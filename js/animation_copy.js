import * as THREE from 'three';
import {GLTFLoader} from 'GLTFLoader';
import {OrbitControls} from 'OrbitControls';


let mixer,currentAction,animationMap,animationName,previousTime;
let model, x, y, z;

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
    const near = 100;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov,width/height,near,far);
    camera.position.set(0,120,600);
    scene.add(camera)

    function changeAnimation(animationName){
        const previousAcition = currentAction;
        currentAction = animationMap[animationName];

        if(previousAcition !== currentAction){
            previousAcition.fadeOut(0.5);
            currentAction.reset().fadeIn(0.5).play();
        }
    }

    function animations(gltf){
        const shark = gltf.scene;
        const gltfAnimation = gltf.animations;

        mixer = new THREE.AnimationMixer(shark);
        animationMap = {};

        const btnsDIV = document.querySelector('.btns');
        gltfAnimation.forEach(animationClip => {
            const name = animationClip.name;
            const btns = document.createElement('div');
            btns.classList.add('on');
            btns.innerText = name;
            btnsDIV.appendChild(btns);

            const animationAction = mixer.clipAction(animationClip);
            animationMap[name] = animationAction;

            btns.addEventListener('click',()=>{
                animationName = btns.innerHTML;
                changeAnimation(animationName);
            })
        })

        currentAction = animationMap['Swimming01.001'];
        currentAction.play(); 
    }

    const loader = new GLTFLoader();
    loader.load('./data/white_pointer.glb',(gltf)=>{
        model = gltf.scene;
        scene.add(model);

        animations(gltf);
    })

    const path = new THREE.SplineCurve( [
        new THREE.Vector2( 200, 100 ),
        new THREE.Vector2( 100, 100 ),
        new THREE.Vector2( 100, 200 ),
        new THREE.Vector2( -100, 200 ),
        new THREE.Vector2( -100, 100 ),
        new THREE.Vector2( -200, 100 ),
        new THREE.Vector2( -200, -100 ),
        new THREE.Vector2( -100, -100 ),
        new THREE.Vector2( -100, -200 ),
        new THREE.Vector2( 100, -200 ),
        new THREE.Vector2( 100, -100 ),
        new THREE.Vector2( 200, -100 ),
        new THREE.Vector2( 200, 100 ),
    ]);
    const points = path.getPoints( 130 );
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({color:0xff0000});
    const pathLine = new THREE.Line(geometry,material);
    pathLine.rotation.x = Math.PI * .5;
    scene.add(pathLine);

    // const boxgeometry = new THREE.BoxGeometry(20,20,60);
    // const boxmaterial = new THREE.MeshPhongMaterial({color:0xffff00});
    // model = new THREE.Mesh(boxgeometry,boxmaterial);
    // scene.add(model);

    const light = new THREE.DirectionalLight({color:0x000000,intensity:1});
    light.position.set(-1,2,4);
    camera.add(light);


    function update(time){
        time *= 0.001;
        
        if(mixer){
            const xTime = time - previousTime;
            mixer.update(xTime);
        }
        previousTime = time;

    }

    function render(time){
        update(time);
        renderer.render(scene,camera);
        requestAnimationFrame(render);
        control.update();

        const boxTime = time * 0.0001;
        const boxPosition = new THREE.Vector3();
        const NextBoxPosition = new THREE.Vector2();

        path.getPointAt(boxTime % 1, boxPosition);
        path.getPointAt((boxTime + 0.01) % 1, NextBoxPosition);

        model.position.set(boxPosition.x, 0, boxPosition.y);
        model.lookAt(NextBoxPosition.x,0,NextBoxPosition.y);
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
