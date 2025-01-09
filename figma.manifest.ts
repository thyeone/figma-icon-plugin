export default {
  name: 'figma-icon-plugin',
  id: '00000000',
  api: '1.0.0',
  main: 'code.js',
  ui: 'index.html',
  editorType: ['figma'],
  networkAccess: {
    allowedDomains: ['*'],
    reasoning:
      'Plugin needs to access Bitbucket API for repository integration',
  },
};
