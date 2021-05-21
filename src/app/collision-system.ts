import { ComponentMapper, ComponentSetBuilder, EntitySystem } from '@cbartel_ci/tsecs';
import { TransformComponent } from './transform-component';
import { MassComponent } from './mass-component';
import { MoveComponent } from './move-component';

export class CollisionSystem extends EntitySystem {
  private transformComponentMapper!: ComponentMapper<TransformComponent>;

  private moveComponentMapper!: ComponentMapper<MoveComponent>;

  private massComponentMapper!: ComponentMapper<MassComponent>;

  initComponentSet(componentSetBuilder: ComponentSetBuilder): ComponentSetBuilder {
    return componentSetBuilder.containingAll(TransformComponent, MassComponent, MoveComponent);
  }

  onInit(): void {
    this.transformComponentMapper = this.getWorld().getComponentMapper(TransformComponent);
    this.moveComponentMapper = this.getWorld().getComponentMapper(MoveComponent);
    this.massComponentMapper = this.getWorld().getComponentMapper(MassComponent);
  }

  onUpdate(): void {
    const deleted: number[] = [];
    this.getEntities().forEach((entity) => {
      if (deleted.filter((id) => entity === id).length > 0) {
        return;
      }
      const transformComponent = this.transformComponentMapper.getComponent(entity);
      this.getEntities().forEach((other) => {
        if (entity === other) {
          return;
        }
        if (deleted.filter((id) => other === id).length > 0) {
          return;
        }
        const otherTransformComponent = this.transformComponentMapper.getComponent(other);
        const dx = otherTransformComponent.x - transformComponent.x;
        const dy = otherTransformComponent.y - transformComponent.y;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r < 5) {
          const moveComponent = this.moveComponentMapper.getComponent(entity);
          const massComponent = this.massComponentMapper.getComponent(entity);
          const otherMoveComponent = this.moveComponentMapper.getComponent(other);
          const otherMassComponent = this.massComponentMapper.getComponent(other);
          moveComponent.v.x =
            (otherMoveComponent.v.x * otherMassComponent.m + moveComponent.v.x * massComponent.m) /
            (otherMassComponent.m + massComponent.m);
          moveComponent.v.y =
            (otherMoveComponent.v.y * otherMassComponent.m + moveComponent.v.y * massComponent.m) /
            (otherMassComponent.m + massComponent.m);
          massComponent.m += otherMassComponent.m;
          deleted.push(other);
          console.log(`collision between ${entity} and ${other}, deleting entity #${other}`);
          this.getWorld().deleteEntity(other);
        }
      });
    });
  }
}
