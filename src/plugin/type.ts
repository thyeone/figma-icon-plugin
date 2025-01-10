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
    figmaToken?: string;
    bitbucketToken?: string;
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

export interface SetTokenUIMessage {
  type: 'setToken';
  payload: string;
}

export type UIMessage =
  | ExtractUIMessage
  | GetTokenUIMessage
  | SetTokenUIMessage;
