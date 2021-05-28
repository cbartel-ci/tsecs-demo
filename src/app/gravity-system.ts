import { ComponentMapper, ComponentSetBuilder, EntitySystem, Mapper } from '@cbartel_ci/tsecs';
import { TransformComponent } from './transform-component';
import { MoveComponent } from './move-component';
import { MassComponent } from './mass-component';

export class GravitySystem extends EntitySystem {
  @Mapper(TransformComponent)
  private transformComponentMapper!: ComponentMapper<TransformComponent>;

  @Mapper(MoveComponent)
  private moveComponentMapper!: ComponentMapper<MoveComponent>;

  @Mapper(MassComponent)
  private massComponentMapper!: ComponentMapper<MassComponent>;

  initComponentSet(componentSetBuilder: ComponentSetBuilder): ComponentSetBuilder {
    return componentSetBuilder.containingAll(TransformComponent, MoveComponent, MassComponent);
  }

  onInit(): void {}

  onUpdate(dt: number): void {
    this.getEntities().forEach((entity) => {
      const transformComponent = this.transformComponentMapper.getComponent(entity);
      const moveComponent = this.moveComponentMapper.getComponent(entity);
      this.getEntities().forEach((other) => {
        if (entity === other) {
          return;
        }
        const otherTransformComponent = this.transformComponentMapper.getComponent(other);
        const otherMassComponent = this.massComponentMapper.getComponent(other);

        const dx = otherTransformComponent.x - transformComponent.x;
        const dy = otherTransformComponent.y - transformComponent.y;
        let r = Math.sqrt(dx * dx + dy * dy);
        if (r < 20) {
          r = 20;
        }

        const G = 0.1;

        // eslint-disable-next-line no-restricted-properties
        const a = (otherMassComponent.m / r ** 3) * G;

        const ax = a * dx;
        const ay = a * dy;

        moveComponent.v.x += ax * dt;
        moveComponent.v.y += ay * dt;
      });
    });
  }
}
