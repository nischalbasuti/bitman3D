import {
  CannonJSPlugin,
  Engine,
  HemisphericLight,
  PointLight,
  Scene,
  Vector3,
} from "@babylonjs/core";
import * as CANNON from "cannon-es";

export default class Game {
  private static instance: Game;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Game();
    }

    return this.instance;
  }

  canvas: HTMLCanvasElement;
  engine: Engine;
  scene: Scene;

  private constructor() {
    // // Create the canvas HTML element and attach it to the webpage
    // const canvas = document.createElement("canvas");
    // document.body.appendChild(canvas);
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);

    // Setup physics
    const cannonPlugin = new CannonJSPlugin(true, 10, CANNON);
    this.scene.enablePhysics(new Vector3(0, -9.81, 0), cannonPlugin);

    // Create a basic light
    const hemlight = new HemisphericLight(
      "light",
      new Vector3(1, 1, 0),
      this.scene
    );
    hemlight.intensity = 0.9;

    // // Create a point light
    // const pointLight = new PointLight(
    //   "pointLight",
    //   new Vector3(1, 10, 1),
    //   this.scene
    // );
    // pointLight.intensity = 0.4;

    // Run the render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    // Resize the engine on window resize
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }
}
