import { ComponentSetBuilder, Entity, EntitySystem } from '@cbartel_ci/tsecs';
import { Container } from 'pixi.js';
// @ts-ignore
import Gradient from 'javascript-color-gradient';
import { TransformComponent } from './transform-component';
import { ParticleComponent } from './particle-component';
import { MassComponent } from './mass-component';

export class ParticleSystem extends EntitySystem {
  private gradient!: Gradient;

  constructor(private readonly stage: Container) {
    super();
  }

  initComponentSet(componentSetBuilder: ComponentSetBuilder): ComponentSetBuilder {
    return componentSetBuilder.containingAll(TransformComponent, ParticleComponent);
  }

  onInit(): void {
    this.gradient = new Gradient();
    const color1 = '#FFFFFF';
    const color2 = '#e9446a';
    const color3 = '#edc988';
    const color4 = '#607D8B';
    this.gradient.setMidpoint(50);
    this.gradient.setGradient(color4, color1, color3, color2);
  }

  onUpdate(dt: number): void {
    this.getEntities().forEach((entity) => {
      const particleComponent = entity.getComponent<ParticleComponent>(ParticleComponent);
      const transformComponent = entity.getComponent<TransformComponent>(TransformComponent);
      const massComponent = entity.getComponent<MassComponent>(MassComponent);
      const mass = massComponent ? Math.floor(massComponent.m) + 1 : 1;
      const { graphics } = particleComponent;

      const color: number = parseInt(this.gradient.getColor(Math.sqrt(mass * 2)).substr(1, 7), 16);

      graphics.clear();
      graphics.beginFill(color);
      graphics.drawCircle(transformComponent.x, transformComponent.y, Math.sqrt(mass));
      graphics.endFill();
    });
  }

  onEntityAdd(entity: Entity) {
    this.stage.addChild(entity.getComponent<ParticleComponent>(ParticleComponent).graphics);
    console.log(`particle system: added entity ${entity.getEntityId()} to stage.`);
  }

  onEntityRemove(entity: Entity) {
    const { graphics } = entity.getComponent<ParticleComponent>(ParticleComponent);
    graphics.clear();
    this.stage.removeChild(graphics);
    console.log(`particle system: removed entity ${entity.getEntityId()} from stage.`);
  }
}
