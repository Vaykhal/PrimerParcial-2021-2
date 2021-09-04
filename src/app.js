// Imports
import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import * as dat from 'dat.gui';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';

// Configuracion basica
let gui = undefined;
let size = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

// Paleta de colores
const palette = {
  bgColor: '#3B8183', // CSS String
};

let plane = undefined;

// Variables generales
let countCube = undefined;
let countSphere = undefined;
let countDirectionalLight = undefined;
let countAmbientLight = undefined;
let countSpotLight = undefined;
let countPointLight = undefined;


let GUIFolderCube = 1;
let GUIFolderSphere = 1;
let GUIFolderDirectionalLight = 1;
let GUIFolderAmbientLight = 1;
let GUIFolderSpotLight = 1;
let GUIFolderPointLight = 1;

// Arreglos de objetos
const objectsCube = [];
const objectsSphere = [];
const objectsAmbientLight = [];
const objectsDirectionalLight = [];
const objectsSpotLight = [];
const objectsPointLight = [];

//AJUSTAR LA VENTANA
window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};

//REINICIAR LAS ACCIONES AL DARLE A "VOLVER"
export function reset() {
  scene.children = [];
  renderer.setSize(0, 0, true);

  countCube = 1;
  countSphere = 1;
  countAmbientLight = 1;
  countDirectionalLight = 1;
  countSpotLight = 1;
  countPointLight = 1;

  GUIFolderCube = 1;
  GUIFolderSphere = 1;
  GUIFolderAmbientLight = 1;
  GUIFolderDirectionalLight = 1;
  GUIFolderSpotLight = 1;
  GUIFolderPointLight = 1;
  
}

export function main(optionSize) {
  reset();
  // Configuracion inicial
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(palette.bgColor, 1);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 15;
  camera.position.y = 15;

  // Controls
  new OrbitControls(camera, renderer.domElement);

  // Plano por defecto
  defaultPlane(optionSize);

  // GUI
  loadGUI();

  // Render
  animate();
}

//CREACIÓN DEL PLANO QUE SE USA COMO SUELO
function defaultPlane(size) {
  const geometry = new THREE.PlaneGeometry(size, size, size, size);
  const material = new THREE.MeshPhongMaterial({
    color: '#FAD089',
    side: THREE.DoubleSide,
    wireframe: false,
  });
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  plane.receiveShadow = true;
  plane.rotation.x = Math.PI / 2;
}

//
function loadGUI() {
  cleanGUI();
  gui = new dat.GUI();
  gui.open();
}

// Limpia el GUI
export function cleanGUI() {
  const dom = document.querySelector('.dg.main');
  if (dom) dom.remove();
}

function animate() {
  requestAnimationFrame(animate);
  updateElements();
  renderer.render(scene, camera);
}

//ACTUALIZACIÓN DE DATOS
function updateElements() {
  _updateCubes();
  _updateSpheres();
  _updateAmbientLight();
  _updateDirectionalLight();
  _updateSpotLight();
  _updatePointLight();
}

//CREACIÓN DEL CUBO Y SUS COMPONENTES
export function createCubeGeneric() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0xffaec0,
    wireframe: false,
  });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);
  objectsCube.push(cube);
  cube.position.y = 0.5;
  cube.castShadow = true;
  cube.receiveShadow = true;

  cube.GUIcube = _cubeObject();
  _createCubeGUI(cube.GUIcube);

  countCube = countCube + 1;
}

//CREACIÓN DE LA ESFERA
export function createSphereGeneric() {
  const geometry = new THREE.SphereGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0xffaec0,
    wireframe: false,
  });
  const sphere = new THREE.Mesh(geometry, material);

  scene.add(sphere);
  objectsSphere.push(sphere);
  sphere.position.y = 0.5;
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  sphere.GUIsphere = _sphereObject();
  _createSphereGUI(sphere.GUIsphere);

  countSphere = countSphere + 1;
}

//CREACIÓN DE LA LUZ AMBIENTAL
export function createAmbientLightGeneric() {
  const ambientalLight = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add(ambientalLight);

  objectsAmbientLight.push(ambientalLight);
  ambientalLight.GUIambiental = _ambientalObject();

  _createAmbientalLightGenericGUI(ambientalLight.GUIambiental);

  countAmbientLight= countAmbientLight + 1;
}

//CREACIÓN DE LA LUZ DIRECTIONAL
export function createDirectionalLightGeneric() {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
  scene.add(directionalLight);

  objectsDirectionalLight.push(directionalLight);
  directionalLight.GUIdirectional = _directionalObject();

  _createDirectionalLightGenericGUI(directionalLight.GUIdirectional);

  countDirectionalLight = countDirectionalLight + 1;
}

//CREACIÓN DEL FOCO DE LUZ
export function createSpotLightGeneric() {
  const spotLight = new THREE.SpotLight(0xA71F8B, 1); 
  spotLight.position.set(0, 10, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;
  spotLight.castShadow = true;


  objectsSpotLight.push(spotLight)
  scene.add(spotLight);


spotLight.GUIspotLight = _spotLightObject();
_createSpotLightGenericGUI(spotLight.GUIspotLight);

countSpotLight = countSpotLight + 1;
}

//CREACIÓN DEL PUNTO DE LUZ
export function createPointLightGeneric() {
  const pointLight = new THREE.PointLight({ 
    color: 0x000000,
    intensity: 1,
    distance: 100,
    decay: 1,
  });

  pointLight.position.set(50,50,50);

  scene.add(pointLight);

  pointLight.GUIpointLight = _pointLightObject();
  _createPointLightGenericGUI(pointLight.GUIpointLight);
  

  countPointLight = countPointLight + 1; 
}

//CARACTERÍSTICAS DEL CUBO
function _cubeObject() {
  var GUIcube = {
    material: 'Basic',
    materialColor: 0xFF9C5B,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    WIREFRAME: false,
    seg1: 16,
    seg2: 16,
    seg3: 16,
    posX: 0,
    posY: 0.5,
    posZ: 0,
  };

  return GUIcube;
}

//CARACTERÍSTICAS DE LA ESFERA
function _sphereObject(){
  var GUIsphere = {
    material: 'Basic',
    materialColor: 0xFF9C5B,
    radio: 1,
    WIREFRAME: false,
    seg1: 32,
    seg2: 16,
    posX: 0,
    posY: 0.5,
    posZ: 0,
  };

  return GUIsphere;
}

//CARACTERÍSTICAS DE LA LUZ DE AMBIENTE
function _ambientalObject() {
  var GUIambiental = { 
    colorLA: 0xffffff, 
    intensidadLA: 0.4,
  };

  return GUIambiental;
}


//CARACTERÍSTICAS DE LA LUZ DIRECCIONAL
function _directionalObject() {
  var GUIdirectional = { 
    colorLD: 0xffffff, 
    intensidadLD: 0.4,
  };

  return GUIdirectional;
}

//CARACTERÍSTICAS DEL FOCO DE LUZ
function  _spotLightObject() {
  var GUIspotLight = {
    colorSL: 0xFFFAF0,
    intensidadSL: 1,
    castShadow: true,
    posX: 0,
    posY: 10,
    posZ: 0,
    anguloSL: Math.PI / 4,
    penumbraSL: 0.1,
    decaySL: 2,
    distanciaSL: 200,
    };
  
  return GUIspotLight;
}

//CARACTERÍSTICAS DEL PUNTO DE LUZ
function _pointLightObject() {
  var GUIpointLight = {
    colorPL: 0xFFFAF0,
    intensidadPL: 1,
    castShadow: true,
    distanciaPL: 200,
    decayPL:2,
  }

  return GUIpointLight;
}

//CREACIÓN DE LA CARPETA CUBO Y COMPONENTES
function _createCubeGUI(GUIcube) {
  const folder = gui.addFolder('Cubo ' + GUIFolderCube);

  // Material
  folder.addColor(GUIcube, 'materialColor').name('Color del cubo');
  folder.add(GUIcube, 'material', ['Basic', 'Phong', 'Lambert']).name('Tipo de material');

  // Escala
  folder.add(GUIcube, 'scaleX').name('Tamaño en X');
  folder.add(GUIcube, 'scaleY').name('Tamaño en Y');
  folder.add(GUIcube, 'scaleZ').name('Tamaño en Z');

  folder.add(GUIcube, 'WIREFRAME').name('Mostrar Wireframe');

  // Posicion
  folder.add(GUIcube, 'posX').name('Posición en X');
  folder.add(GUIcube, 'posY').name('Posición en Y');
  folder.add(GUIcube, 'posZ').name('Posición en Z');

  //Segmentos
  folder.add(GUIcube, 'seg1').name('Segmentos - Ancho');
  folder.add(GUIcube, 'seg2').name('Segmentos - Altura');
  folder.add(GUIcube, 'seg3').name('Segmentos - Profundidad');

  GUIFolderCube = GUIFolderCube + 1;
}

//CREACIÓN DE LA CARPETA ESFERA Y COMPONENTES
function _createSphereGUI(GUIsphere) {
  const folder = gui.addFolder('Esfera ' + GUIFolderSphere);

  // Material
  folder.addColor(GUIsphere, 'materialColor').name('Color de la esfera');
  folder.add(GUIsphere, 'material', ['Basic', 'Phong', 'Lambert']).name('Tipo de material');

  //Radio
  folder.add(GUIsphere, 'radio').name('Radio');

  //Wireframe
  folder.add(GUIsphere, 'WIREFRAME').name('Mostrar Wireframe');

  // Posicion
  folder.add(GUIsphere, 'posX').name('Posición en X');
  folder.add(GUIsphere, 'posY').name('Posición en Y');
  folder.add(GUIsphere, 'posZ').name('Posición en Z');

  //Segmentos
  folder.add(GUIsphere, 'seg1').name('Segmentos - Ancho');
  folder.add(GUIsphere, 'seg2').name('Segmentos - Altura');
  
  GUIFolderSphere = GUIFolderSphere + 1;
}

//CREACIÓN DE LA CARPETA LUZ AMBIENTAL Y COMPONENTES
function _createAmbientalLightGenericGUI(GUIambiental) {
  //LUZ AMBIENTAL
  const folder = gui.addFolder('Luz ambiental ' + GUIFolderAmbientLight);
  folder.add(GUIambiental, 'intensidadLA').name('Intensidad de luz ambiental');
  folder.addColor(GUIambiental, 'colorLA').name('Color de luz ambiental');

  GUIFolderAmbientLight = GUIFolderAmbientLight + 1;
}

//CREACIÓN DE LA CARPETA LUZ DIRECTIONAL Y COMPONENTES
function _createDirectionalLightGenericGUI(GUIdirectional) {
  //LUZ DIRECCIONAL
  const folder = gui.addFolder('Luz direccional ' + GUIFolderDirectionalLight);
  folder.add(GUIdirectional, 'intensidadLD').name('Intensidad de luz direccional');
  folder.addColor(GUIdirectional, 'colorLD').name('Color de luz direccional');

  GUIFolderDirectionalLight = GUIFolderDirectionalLight + 1;
}

//CREACIÓN DE LA CARPETA FOCO DE LUZ Y COMPONENTES
function _createSpotLightGenericGUI(GUIspotLight) {
  const folder = gui.addFolder('Foco de luz ' + GUIFolderSpotLight);
  // FOCO DE LUZ
  folder.addColor(GUIspotLight, 'colorSL');
  folder.add(GUIspotLight, 'intensidadSL');
  folder.add(GUIspotLight, 'penumbraSL');
  folder.add(GUIspotLight, 'decaySL');
  
  folder.add(GUIspotLight, 'posX');
  folder.add(GUIspotLight, 'posY');
  folder.add(GUIspotLight, 'posZ');
  folder.add(GUIspotLight, 'anguloSL');
  folder.add(GUIspotLight, 'distanciaSL');
  
  GUIFolderSpotLight = GUIFolderSpotLight + 1;
}

//CREACIÓN DE LA CARPETA PUNTO DE LUZ Y COMPONENTES
function _createPointLightGenericGUI(GUIpointLight) {
  const folder = gui.addFolder('Punto de luz ' + GUIFolderPointLight);
  // PUNTO DE LUZ
  folder.addColor(GUIpointLight, 'colorPL');
  folder.add(GUIpointLight, 'intensidadPL');
  folder.add(GUIpointLight, 'distanciaPL');
  folder.add(GUIpointLight, 'decayPL');

  GUIFolderPointLight = GUIFolderPointLight + 1;
}

//ACTUALIZACIÓN DE DATOS CUBO
function _updateCubes() {
  Object.keys(objectsCube).forEach((i) => {
    const cubeSelected = objectsCube[i];

    //Material cubo
    cubeSelected.GUIcube.material == 'Basic'
      ? (cubeSelected.material = new THREE.MeshBasicMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : cubeSelected.GUIcube.material == 'Lambert'
      ? (cubeSelected.material = new THREE.MeshLambertMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : (cubeSelected.material = new THREE.MeshPhongMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }));

    //Escalar cubo
    cubeSelected.geometry = new THREE.BoxGeometry(
      cubeSelected.GUIcube.scaleX,
      cubeSelected.GUIcube.scaleY,
      cubeSelected.GUIcube.scaleZ,

      cubeSelected.GUIcube.seg1,
      cubeSelected.GUIcube.seg2,
      cubeSelected.GUIcube.seg3,
    );
    
    cubeSelected.material.wireframe = cubeSelected.GUIcube.WIREFRAME;


    //Posición
    cubeSelected.position.x = cubeSelected.GUIcube.posX;
    cubeSelected.position.y = cubeSelected.GUIcube.posY;
    cubeSelected.position.z = cubeSelected.GUIcube.posZ;
  });
}

//ACTUALIZACIÓN DE DATOS ESFERA
function _updateSpheres(){
  Object.keys(objectsSphere).forEach((i) => {
    const sphereSelected = objectsSphere[i];

    //Material esfera
    sphereSelected.GUIsphere.material == 'Basic'
      ? (sphereSelected.material = new THREE.MeshBasicMaterial({
          color: sphereSelected.GUIsphere.materialColor,
        }))
      : sphereSelected.GUIsphere.material == 'Lambert'
      ? (sphereSelected.material = new THREE.MeshLambertMaterial({
          color: sphereSelected.GUIsphere.materialColor,
        }))
      : (sphereSelected.material = new THREE.MeshPhongMaterial({
          color: sphereSelected.GUIsphere.materialColor,
        }));
    
    sphereSelected.geometry = new THREE.SphereGeometry(
      sphereSelected.GUIsphere.radio,
      sphereSelected.GUIsphere.seg1,
      sphereSelected.GUIsphere.seg2,
    )
    
    sphereSelected.material.wireframe = sphereSelected.GUIsphere.WIREFRAME;

    //Posición
    sphereSelected.position.x = sphereSelected.GUIsphere.posX;
    sphereSelected.position.y = sphereSelected.GUIsphere.posY;
    sphereSelected.position.z = sphereSelected.GUIsphere.posZ;
    
  });
}

//ACTUALIZACIÓN DE DATOS LUZ AMBIENTE
function _updateAmbientLight(){
  Object.keys(objectsAmbientLight).forEach((i) => {
    const ambientSelected = objectsAmbientLight[i];

    ambientSelected.color.setHex(ambientSelected.GUIambiental.colorLA);
    ambientSelected.intensity = ambientSelected.GUIambiental.intensidadLA;

    scene.add(ambientSelected);
  
  });
}

//ACTUALIZACIÓN DE DATOS LUZ DIRECCIONAL
function _updateDirectionalLight(){
  Object.keys(objectsDirectionalLight).forEach((i) => {
    const directionalSelected = objectsDirectionalLight[i];

    directionalSelected.color.setHex(directionalSelected.GUIdirectional.colorLD);
    directionalSelected.intensity = directionalSelected.GUIdirectional.intensidadLD;

    scene.add(directionalSelected);
  
  });
}

//ACTUALIZACIÓN DE DATOS FOCO DE LUZ
function _updateSpotLight() {
  Object.keys(objectsSpotLight).forEach((i) => {
    const spotLightSelected = objectsSpotLight[i];
  
    spotLightSelected.color.setHex(spotLightSelected.GUIspotLight.colorSL);
    spotLightSelected.intensity = spotLightSelected.GUIspotLight.intensidadSL;
    spotLightSelected.penumbra = spotLightSelected.GUIspotLight.penumbraSL;
    spotLightSelected.decay = spotLightSelected.GUIspotLight.decaySL;
    

        //Posición
    spotLightSelected.position.x = spotLightSelected.GUIspotLight.posX;
    spotLightSelected.position.y = spotLightSelected.GUIspotLight.posY;
    spotLightSelected.position.z = spotLightSelected.GUIspotLight.posZ;
    spotLightSelected.angle = spotLightSelected.GUIspotLight.anguloSL;
    spotLightSelected.distance = spotLightSelected.GUIspotLight.distanciaSL;
  });
  }

  //ACTUALIZACIÓN DE DATOS PUNTO DE LUZ
function _updatePointLight() {
  Object.keys(objectsPointLight).forEach((i) => {
    const pointLightSelected = objectsPointLight[i];

    pointLightSelected.color.setHex(pointLightSelected.GUIpointLight.colorPL);
    pointLightSelected.intensity = pointLightSelected.GUIpointLight.intensidadPL;
    pointLightSelected.distance = pointLightSelected.GUIpointLight.distanciaPL;
    pointLightSelected.decay = pointLightSelected.GUIpointLight.decayPL;

  });
}