import { ComponentSetBuilder, EntitySystem } from '@cbartel_ci/tsecs';
import { TransformComponent } from './transform-component';
import { MassComponent } from './mass-component';
import { MoveComponent } from './move-component';

export class CollisionSystem extends EntitySystem {
  initComponentSet(componentSetBuilder: ComponentSetBuilder): ComponentSetBuilder {
    return componentSetBuilder.containingAll(TransformComponent, MassComponent, MoveComponent);
  }

  onInit(): void {}

  onUpdate(): void {
    const deleted: number[] = [];
    this.getEntities().forEach((entity) => {
      if (deleted.filter((id) => entity.getEntityId() === id).length > 0) {
        return;
      }
      const transformComponent = entity.getComponent<TransformComponent>(TransformComponent);
      this.getEntities().forEach((other) => {
        if (entity === other) {
          return;
        }
        if (deleted.filter((id) => other.getEntityId() === id).length > 0) {
          return;
        }
        const otherTransformComponent = other.getComponent<TransformComponent>(TransformComponent);
        const dx = otherTransformComponent.x - transformComponent.x;
        const dy = otherTransformComponent.y - transformComponent.y;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r < 5) {
          const moveComponent = entity.getComponent<MoveComponent>(MoveComponent);
          const massComponent = entity.getComponent<MassComponent>(MassComponent);
          const otherMoveComponent = other.getComponent<MoveComponent>(MoveComponent);
          const otherMassComponent = other.getComponent<MassComponent>(MassComponent);
          moveComponent.v.x =
            (otherMoveComponent.v.x * otherMassComponent.m + moveComponent.v.x * massComponent.m) /
            (otherMassComponent.m + massComponent.m);
          moveComponent.v.y =
            (otherMoveComponent.v.y * otherMassComponent.m + moveComponent.v.y * massComponent.m) /
            (otherMassComponent.m + massComponent.m);
          massComponent.m += otherMassComponent.m;
          deleted.push(other.getEntityId());
          console.log(
            `collision between ${entity.getEntityId()} and ${other.getEntityId()}, deleting entity #${other.getEntityId()}`
          );
          this.getWorld().deleteEntityById(other.getEntityId());
        }
      });
    });
  }
}
