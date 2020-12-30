import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    BoxGeometry,
    MeshLambertMaterial,
    Mesh,
    AmbientLight, SpotLight
} from "three";
import {audio, AudiosOpt} from "@/core/audio";

class Animate {
    private static instance: Animate;
    public scene: Scene = new Scene();
    public renderer: WebGLRenderer = new WebGLRenderer({alpha: true});
    public camera: PerspectiveCamera = null;
    public cube: Mesh = null;
    public waveform: Uint8Array = null;
    public frequency: Uint8Array = null;

    static getInstance() {
        if (!Animate.instance) Animate.instance = new Animate();
        return Animate.instance;
    }

    constructor() {
    }

    init(el: HTMLElement) {
        this.camera = new PerspectiveCamera(75, el.offsetWidth / el.offsetHeight, 0.1, 1000);
        this.renderer.setSize(el.offsetWidth, el.offsetHeight);
        this.renderer.shadowMap.enabled = true;
        el.appendChild(this.renderer.domElement);
        this.waveform = new Uint8Array(audio.analyser.frequencyBinCount);
        this.frequency = new Uint8Array(audio.analyser.frequencyBinCount);
    }

    box() {
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshLambertMaterial({color: 0x00ffff});

        this.cube = new Mesh(geometry, material);
        this.cube.castShadow = true;
        this.scene.add(this.cube);
        this.camera.position.z = 5;

        this.scene.add(new AmbientLight(0x444444));
        const light = new SpotLight(0xffffff);
        light.position.set(-2, -3, 0);
        light.castShadow = true;
        this.scene.add(light);
    }

    refresh() {
        audio.analyser.getByteTimeDomainData(this.waveform);
        audio.analyser.getByteFrequencyData(this.frequency);
        if (AudiosOpt.paused === 1) {
            let i = 0;
            this.frequency.map(e => i += e);
            let s = i / (10000 - (AudiosOpt.volume * 1000));
            this.cube.scale.set(s, s, s);
        }else this.cube.scale.set(1, 1, 1);
        animate.cube.rotation.x += 0.01;
        animate.cube.rotation.y += 0.01;
        animate.renderer.render(animate.scene, animate.camera);
    }

}

export const animate = Animate.getInstance();

let animateRefreshNum: number = 0;

export function animateRefresh() {
    animateRefreshNum = requestAnimationFrame(animateRefresh);
    animate.refresh();
}

export function animateStop() {
    if (animateRefreshNum) cancelAnimationFrame(animateRefreshNum);
    animate.renderer.clear();
}