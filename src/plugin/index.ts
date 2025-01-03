import type {
  ExtractIconPluginMessage,
  GetTokenPluginMessage,
  PluginMessage,
  UIMessage,
} from './type';
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

figma.ui.onmessage = async (msg: UIMessage) => {
  if (msg.type === 'extract') {
    extractIcon();
  }

  if (msg.type === 'getToken') {
    const token = await figma.clientStorage.getAsync('token');

    const pluginMessage: GetTokenPluginMessage = {
      type: 'getToken',
      payload: token,
    };

    figma.ui.postMessage(pluginMessage);
  }

  if (msg.type === 'setToken') {
    await figma.clientStorage.setAsync('token', msg.payload);
  }
};
