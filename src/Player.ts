import {
  AbstractMesh,
  GroundMesh,
  MeshBuilder,
  PhysicsImpostor,
  Quaternion,
  Ray,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";
import Game from "./Game";
import PlayerCamera from "./PlayerCamera";
import bitmanStill from "./assets/bitman/default/still.png";

export default class Player {
  mesh: AbstractMesh;
  playerCamera: PlayerCamera;

  constructor() {
    const scene = Game.getInstance().scene;
    this.mesh = MeshBuilder.CreateBox("player", { size: 1 }, scene);
    this.mesh.position.y = 0.5;

    this.mesh.physicsImpostor = new PhysicsImpostor(
      this.mesh,
      PhysicsImpostor.BoxImpostor,
      { mass: 1 },
      scene
    );

    this.playerCamera = new PlayerCamera();

    const material = new StandardMaterial("playerMaterial", scene);
    // material.diffuseTexture = new Texture(bitmanStill, scene);
    material.emissiveTexture = new Texture(bitmanStill, scene);

    material.disableLighting = true;

    this.mesh.material = material;
  }

  moveForward() {
    const direction = this.playerCamera.getForward(this.moveMagnitude);
    this.move(direction);
  }

  moveBackward() {
    const direction = this.playerCamera.getForward(-this.moveMagnitude);
    this.move(direction);
  }

  moveRight() {
    const direction = this.playerCamera.getRight(this.moveMagnitude);
    this.move(direction);
  }

  moveLeft() {
    const direction = this.playerCamera.getRight(-this.moveMagnitude);
    this.move(direction);
  }

  private moveMagnitude = 0.3;
  move(direction: Vector3) {
    this.mesh.moveWithCollisions(direction);
    // this.mesh.physicsImpostor?.setLinearVelocity(direction);
    // this.mesh.physicsImpostor?.applyImpulse(direction, this.mesh.getAbsolutePosition());
  }

  jump() {
    this.mesh.applyImpulse(
      Vector3.Up().multiplyByFloats(4, 4, 4),
      Vector3.Down()
    );
  }

  isTouchingGround() {
    const minimum = this.mesh.getBoundingInfo().boundingBox.minimum;

    const start = this.mesh.position.add(new Vector3(0, minimum.y, 0));
    const end = this.mesh.position.add(new Vector3(0, minimum.y - 0.1, 0));
    const ray = Ray.CreateNewFromTo(start, end);

    const pick = Game.getInstance().scene.pickWithRay(
      ray,
      (mesh) => {
        return mesh != this.mesh;
      },
      true
    );

    return !!pick?.hit;
  }

  reset() {
    this.mesh.position = new Vector3(0, 2, 0);
    this.mesh.physicsImpostor!.setAngularVelocity(Vector3.Zero());
    this.mesh.physicsImpostor!.setLinearVelocity(Vector3.Zero());

    var x = new Vector3(0, 0, 0);
    var a = Math.PI / 8;
    var rot = Quaternion.RotationAxis(x, a);
    this.mesh.rotationQuaternion = rot;

    this.playerCamera.reset();
  }
}
