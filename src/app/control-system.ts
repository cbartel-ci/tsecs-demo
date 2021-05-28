import { ComponentMapper, Mapper, System } from '@cbartel_ci/tsecs';
import { ParticleComponent } from './particle-component';
import { TransformComponent } from './transform-component';
import { MassComponent } from './mass-component';
import { MoveComponent } from './move-component';

export class ControlSystem extends System {
  private mouseX = 0;

  private mouseY = 0;

  private keyboardEvents: KeyboardEvent[] = [];

  @Mapper(TransformComponent)
  private transformComponentMapper!: ComponentMapper<TransformComponent>;

  @Mapper(ParticleComponent)
  private particleComponentMapper!: ComponentMapper<ParticleComponent>;

  @Mapper(MassComponent)
  private massComponentMapper!: ComponentMapper<MassComponent>;

  @Mapper(MoveComponent)
  private moveComponentMapper!: ComponentMapper<MoveComponent>;

  onInit(): void {
    window.addEventListener('mousemove', (event) => {
      this.mouseX = event.offsetX;
      this.mouseY = event.offsetY;
    });

    window.addEventListener('keydown', (event) => {
      this.keyboardEvents.push(event);
    });
  }

  private gaussian(min: number, max: number, skew: number) {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = this.gaussian(min, max, skew);
    // resample between 0 and 1 if out of range
    else {
      num **= skew; // Skew
      num *= max - min; // Stretch to fill range
      num += min; // offset to min
    }
    return num;
  }

  onUpdate(dt: number): void {
    while (this.keyboardEvents.length > 0) {
      const event = this.keyboardEvents.pop()!;
      if (event.key === 'Enter') {
        const entity = this.getWorld().createEntity();
        const particleComponent = new ParticleComponent();
        const transformComponent = new TransformComponent();
        const massComponent = new MassComponent();
        const moveComponent = new MoveComponent();
        transformComponent.x = this.mouseX;
        transformComponent.y = this.mouseY;
        const min = 75;
        const max = 110;
        const skew = 2;
        const offset = 80;
        let m = this.gaussian(min, max, skew) - offset;
        if (m <= 0.1) {
          m = 0.1;
        }
        massComponent.m = m;
        this.particleComponentMapper.addComponent(entity, particleComponent);
        this.transformComponentMapper.addComponent(entity, transformComponent);
        this.massComponentMapper.addComponent(entity, massComponent);
        this.moveComponentMapper.addComponent(entity, moveComponent);
        console.log(`Entity ${entity} created.`);
      }
    }
  }
}
