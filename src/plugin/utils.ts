export const findAllComponentNode = (rootNode: SceneNode) => {
  const components: ComponentNode[] = [];
  const queue: SceneNode[] = [rootNode];

  while (queue.length > 0) {
    const node = queue.shift()!;

    if (isComponentNode(node)) {
      components.push(node);
    }

    if ('children' in node) {
      queue.push(...node.children);
    }
  }

  return components;
};

export const flatten = <T>(a: T[], b: T[]) => [...a, ...b];

export const isComponentNode = (node: SceneNode): node is ComponentNode =>
  node.type === 'COMPONENT';

export const isComponentSetNode = (node: SceneNode): node is ComponentSetNode =>
  node.type === 'COMPONENT_SET';
