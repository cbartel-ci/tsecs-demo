import { ComponentMapper, ComponentSetBuilder, EntitySystem } from '@cbartel_ci/tsecs';
import { Container } from 'pixi.js';
// @ts-ignore
import Gradient from 'javascript-color-gradient';
import { TransformComponent } from './transform-component';
import { ParticleComponent } from './particle-component';
import { MassComponent } from './mass-component';

export class ParticleSystem extends EntitySystem {
  private particleComponentMapper!: ComponentMapper<ParticleComponent>;

  private transformComponentmapper!: ComponentMapper<TransformComponent>;

  private massComponentMapper!: ComponentMapper<MassComponent>;

  private gradient!: Gradient;

  constructor(private readonly stage: Container) {
    super();
  }

  initComponentSet(componentSetBuilder: ComponentSetBuilder): ComponentSetBuilder {
    return componentSetBuilder.containingAll(TransformComponent, ParticleComponent);
  }

  onInit(): void {
    this.particleComponentMapper = this.getWorld().getComponentMapper(ParticleComponent);
    this.transformComponentmapper = this.getWorld().getComponentMapper(TransformComponent);
    this.massComponentMapper = this.getWorld().getComponentMapper(MassComponent);

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
      const particleComponent = this.particleComponentMapper.getComponent(entity);
      const transformComponent = this.transformComponentmapper.getComponent(entity);
      const massComponent = this.massComponentMapper.getComponent(entity);
      const mass = massComponent ? Math.floor(massComponent.m) + 1 : 1;
      const { graphics } = particleComponent;

      const color: number = parseInt(this.gradient.getColor(Math.sqrt(mass * 2)).substr(1, 7), 16);

      graphics.clear();
      graphics.beginFill(color);
      graphics.drawCircle(transformComponent.x, transformComponent.y, Math.sqrt(mass));
      graphics.endFill();
    });
  }

  onEntityAdd(entity: number) {
    this.stage.addChild(this.particleComponentMapper.getComponent(entity).graphics);
    console.log(`particle system: added entity ${entity} to stage.`);
  }

  onEntityRemove(entity: number) {
    const { graphics } = this.particleComponentMapper.getComponent(entity);
    graphics.clear();
    this.stage.removeChild(graphics);
    console.log(`particle system: removed entity ${entity} from stage.`);
  }
}
