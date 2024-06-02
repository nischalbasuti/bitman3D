import { ArcRotateCamera, Vector3 } from "@babylonjs/core";
import Game from "./Game";

export default class PlayerCamera {
  camera: ArcRotateCamera;

  constructor() {
    // Create a camera and position it
    this.camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2,
      10,
      Vector3.Zero(),
      Game.getInstance().scene
    );

    this.reset();
  }

  getForward(magnitude = 1) {
    return this.camera
      .getDirection(new Vector3(0, 0, 1))
      .multiplyByFloats(magnitude, 0, magnitude);
  }

  getRight(magnitude = 1) {
    return this.camera
      .getDirection(new Vector3(1, 0, 0))
      .multiplyByFloats(magnitude, 0, magnitude);
  }

  reset() {
    this.camera.position = new Vector3(10, 10, 10);
    this.camera.target = Vector3.Zero();
    this.camera.attachControl(Game.getInstance().canvas, true);
  }
}
