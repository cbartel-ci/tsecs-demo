import { ComponentMapper, ComponentSetBuilder, EntitySystem } from '@cbartel_ci/tsecs';
import { TransformComponent } from './transform-component';
import { MoveComponent } from './move-component';

export class MoveSystem extends EntitySystem {
  private transformComponentMapper!: ComponentMapper<TransformComponent>;

  private moveComponentMapper!: ComponentMapper<MoveComponent>;

  initComponentSet(componentSetBuilder: ComponentSetBuilder): ComponentSetBuilder {
    return componentSetBuilder.containingAll(TransformComponent, MoveComponent);
  }

  onInit(): void {
    this.transformComponentMapper = this.getWorld().getComponentMapper(TransformComponent);
    this.moveComponentMapper = this.getWorld().getComponentMapper(MoveComponent);
  }

  onUpdate(dt: number): void {
    this.getEntities().forEach((entity) => {
      const transformComponent = this.transformComponentMapper.getComponent(entity);
      const moveComponent = this.moveComponentMapper.getComponent(entity);
      transformComponent.x += moveComponent.v.x * dt;
      transformComponent.y += moveComponent.v.y * dt;
    });
  }
}
