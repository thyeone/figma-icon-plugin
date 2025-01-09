export const findAllComponentNode = (rootNode: SceneNode) => {
  const components: ComponentNode[] = [];

  function findComponentNode(node: SceneNode) {
    if (isComponentNode(node)) {
      components.push(node);
      return;
    }

    if ('children' in node) {
      node.children.forEach(findComponentNode);
    }
  }
  findComponentNode(rootNode);

  return components;
};

export const flatten = <T>(a: T[], b: T[]) => [...a, ...b];

export const isComponentNode = (node: SceneNode): node is ComponentNode =>
  node.type === 'COMPONENT';

export const isComponentSetNode = (node: SceneNode): node is ComponentSetNode =>
  node.type === 'COMPONENT_SET';
