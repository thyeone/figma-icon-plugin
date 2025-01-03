import type { ExtractIconPluginMessage, PluginMessage } from './type';
import { findAllComponentNode, flatten } from './utils';

figma.showUI(__html__, {
  height: 230,
});

function extractIcon() {
  const componentNodes = figma.currentPage.selection
    .map(findAllComponentNode)
    .reduce(flatten, [])
    .map(({ id, name }) => ({ id, name }));

  const componentNodesIdsQuery = componentNodes.map(({ id }) => id).join(',');

  const pluginMessage: ExtractIconPluginMessage = {
    type: 'extractIcon',
    payload: {
      fileKey: figma.fileKey as string,
      ids: componentNodesIdsQuery,
      nodes: componentNodes,
    },
  };

  figma.ui.postMessage(pluginMessage);
}
