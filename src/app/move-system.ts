import { ComponentSetBuilder, EntitySystem } from '@cbartel_ci/tsecs';
import { TransformComponent } from './transform-component';
import { MoveComponent } from './move-component';

export class MoveSystem extends EntitySystem {
  initComponentSet(componentSetBuilder: ComponentSetBuilder): ComponentSetBuilder {
    return componentSetBuilder.containingAll(TransformComponent, MoveComponent);
  }

  onInit(): void {}

  onUpdate(dt: number): void {
    this.getEntities().forEach((entity) => {
      const transformComponent = entity.getComponent<TransformComponent>(TransformComponent);
      const moveComponent = entity.getComponent<MoveComponent>(MoveComponent);
      transformComponent.x += moveComponent.v.x * dt;
      transformComponent.y += moveComponent.v.y * dt;
    });
  }
}
