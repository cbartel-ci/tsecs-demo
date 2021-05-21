import { Application, Loader, Text, TextStyle } from 'pixi.js';
import { WorldBuilder } from '@cbartel_ci/tsecs';
import { ControlSystem } from './control-system';
import { ParticleSystem } from './particle-system';
import { GravitySystem } from './gravity-system';
import { MoveSystem } from './move-system';
import { CollisionSystem } from './collision-system';

export class App {
  private app: Application;

  private loader = Loader.shared;

  constructor() {
    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
    });

    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
    });

    document.body.appendChild(this.app.view);

    const text = new Text('press Enter to spawn entities!');
    text.style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 'white',
    });
    text.x = 20;
    text.y = 20;
    this.app.stage.addChild(text);

    this.loader.load(this.setup.bind(this));
  }

  setup(): void {
    const world = new WorldBuilder()
      .with(
        new ControlSystem(),
        new ParticleSystem(this.app.stage),
        new GravitySystem(),
        new MoveSystem(),
        new CollisionSystem()
      )
      .build();

    this.app.ticker.add((dt) => {
      world.update(dt);
    });
  }
}
