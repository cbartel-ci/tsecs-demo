import { ComponentMapper, ComponentSetBuilder, EntitySystem, Mapper } from '@cbartel_ci/tsecs';
import { TransformComponent } from './transform-component';
import { MoveComponent } from './move-component';

export class MoveSystem extends EntitySystem {
  @Mapper(TransformComponent)
  private transformComponentMapper!: ComponentMapper<TransformComponent>;

  @Mapper(MoveComponent)
  private moveComponentMapper!: ComponentMapper<MoveComponent>;

  initComponentSet(componentSetBuilder: ComponentSetBuilder): ComponentSetBuilder {
    return componentSetBuilder.containingAll(TransformComponent, MoveComponent);
  }

  onInit(): void {}

  onUpdate(dt: number): void {
    this.getEntities().forEach((entity) => {
      const transformComponent = this.transformComponentMapper.getComponent(entity);
      const moveComponent = this.moveComponentMapper.getComponent(entity);
      transformComponent.x += moveComponent.v.x * dt;
      transformComponent.y += moveComponent.v.y * dt;
    });
  }
}
