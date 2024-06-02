import { Vector3, MeshBuilder, ExecuteCodeAction, ActionManager, PhysicsImpostor, StandardMaterial, Color4, Color3 } from "@babylonjs/core";
import "@babylonjs/loaders";

import Player from "./Player";
import Game from "./Game";
import Bomb from "./Bomb";

const game = Game.getInstance();

// Create a simple ground
const ground = MeshBuilder.CreateGround(
  "ground",
  { width: 10, height: 10 },
  game.scene
);
ground.physicsImpostor = new PhysicsImpostor(
  ground,
  PhysicsImpostor.BoxImpostor,
  { mass: 0 },
  game.scene
);
ground.receiveShadows = true;
const groundMaterial = new StandardMaterial("groundMaterial", game.scene);
groundMaterial.emissiveColor = new Color3(0/255, 200/255, 0/255);
ground.material = groundMaterial;

const bomb = new Bomb();
const player = new Player();

game.shadowGenerator.addShadowCaster(player.mesh);
game.shadowGenerator.addShadowCaster(bomb.mesh);

// @ts-ignore - for debugging
window.player = player;

// Handle WASD camera movements
const inputMap: { [key: string]: boolean } = {};
game.scene.actionManager = new ActionManager(game.scene);

game.scene.actionManager.registerAction(
  new ExecuteCodeAction(
    ActionManager.OnKeyDownTrigger,
    (evt) => {
      inputMap[evt.sourceEvent.key] = true;
    }
  )
);

game.scene.actionManager.registerAction(
  new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
    inputMap[evt.sourceEvent.key] = false;
  })
);

game.scene.onBeforeRenderObservable.add(() => {
  if (inputMap["w"]) {
    player.moveForward();
  }
  if (inputMap["s"]) {
    player.moveBackward();
  }

  if (inputMap["a"]) {
    player.moveLeft();
  }
  if (inputMap["d"]) {
    player.moveRight();
  }

  if (inputMap["r"]) {
    player.reset();
    bomb.reset();
  }
  if (inputMap[" "]) {
    if (player.isTouchingGround()) {
      player.jump();
    }
  }

  player.playerCamera.camera.position = player.mesh.position.add(new Vector3(10, 10, 10));
  player.playerCamera.camera.target = player.mesh.getAbsolutePosition();
});
