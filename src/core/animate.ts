import {Scene, WebGLRenderer, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh} from "three";

export class Animate {
    public scene: Scene = new Scene();
    public renderer: WebGLRenderer = new WebGLRenderer({alpha: true});
    public camera: PerspectiveCamera = null;
    public cube: Mesh = null;

    constructor() {
    }

    init(el: HTMLElement) {
        this.camera = new PerspectiveCamera(75, el.offsetWidth / el.offsetHeight, 0.1, 1000);
        this.renderer.setSize(el.offsetWidth, el.offsetHeight);
        el.appendChild(this.renderer.domElement);
    }

    box() {
        let geometry = new BoxGeometry(1, 1, 1);
        let material = new MeshBasicMaterial({color: 0x00ff00});
        this.cube = new Mesh(geometry, material);
        this.scene.add(this.cube);
        this.camera.position.z = 5;
    }

}