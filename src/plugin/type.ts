export type SvgByName = { [id: string]: SvgData };

type SvgData = {
  id: string;
  svg: string;
};

export interface ExtractIconPluginMessage {
  type: 'extractIcon';
  payload: {
    svgByName: SvgByName;
  };
}

export interface GetTokenPluginMessage {
  type: 'getToken';
  payload: {
    bitbucketToken?: string;
    exportPath?: string;
    username?: string;
    repositoryName?: string;
    targetBranch?: string;
  };
}

export interface PluginMessage {
  pluginMessage: ExtractIconPluginMessage | GetTokenPluginMessage;
}

export interface ExtractUIMessage {
  type: 'extract';
}

export interface GetTokenUIMessage {
  type: 'getToken';
}

export interface StoredDataLoadedUIMessage {
  type: 'storedDataLoaded';
}

export interface SetTokenUIMessage {
  type: 'setToken';
  payload: string;
}

export type UIMessage =
  | ExtractUIMessage
  | GetTokenUIMessage
  | SetTokenUIMessage;
