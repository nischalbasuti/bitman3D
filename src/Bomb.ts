import {
  AbstractMesh,
  MeshBuilder,
  PhysicsImpostor,
  Quaternion,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";
import * as GUI from '@babylonjs/gui';

import bombFrame0 from "./assets/bomb/explosion_frames/0.png";
import testFrame from "./assets/bomb/pixil-frame-0.png";
import Game from "./Game";

export default class Bomb {
  mesh: AbstractMesh;

  constructor() {
    const scene = Game.getInstance().scene;
    this.mesh = MeshBuilder.CreateSphere(
      "bomb",
      { segments: 16, diameter: 1 },
      scene
    );
    this.mesh.position.y = 0.5;

    this.mesh.physicsImpostor = new PhysicsImpostor(
      this.mesh,
      PhysicsImpostor.SphereImpostor,
      { mass: 1 },
      scene
    );

    this.mesh.scaling.y = -1;

    this.reset();

    const texture = new Texture(testFrame, scene);
    const material = new StandardMaterial("bombMaterial", scene);
    material.emissiveTexture = texture;

    this.mesh.material = material;
    // // Create a multi-material
    // const multiMaterial = new MultiMaterial("multi", scene);
    // multiMaterial.subMaterials.push(material);
    // multiMaterial.subMaterials.push(material);
    //
    // // Apply the multi-material to the sphere
    // this.mesh.material = multiMaterial;
    //
    // this.mesh.subMeshes = [];
    // const verticesCount =  this.mesh.getTotalVertices();
    // const indexCount = this.mesh.getTotalIndices()
    //
    // new SubMesh(0, 0, verticesCount, 0, indexCount/2, this.mesh);
    // new SubMesh(1, 0, verticesCount, 0, indexCount, this.mesh);

    // @ts-ignore
    window.bomb = this;

    this.mesh.physicsImpostor.onCollideEvent = (self, other) => {
      const selfMesh = self.object as AbstractMesh;
      const otherMesh = other.object as AbstractMesh;

      console.log("collision:", selfMesh.name, otherMesh.name);

      if (otherMesh.name == "player") {

        // Create "Game Over" text
        const gameOverText = new GUI.TextBlock();
        gameOverText.text = "Game Over";
        gameOverText.color = "red";
        gameOverText.fontSize = 72;
        gameOverText.horizontalAlignment =
          GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        gameOverText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        // Add text to GUI
        Game.getInstance().advancedTexture.addControl(gameOverText);

        // Hide the text initially
        gameOverText.isVisible = false;

        // Function to show "Game Over" text
        function showGameOver() {
          gameOverText.isVisible = true;
        }

        setTimeout(showGameOver, 200);
      }
    };
  }

  reset() {
    this.mesh.position = new Vector3(0, 5, 0);
    this.mesh.physicsImpostor!.setAngularVelocity(Vector3.Zero());
    this.mesh.physicsImpostor!.setLinearVelocity(Vector3.Zero());

    var x = new Vector3(0, 0, 0);
    var a = Math.PI / 8;
    var rot = Quaternion.RotationAxis(x, a);
    this.mesh.rotationQuaternion = rot;
  }
}
