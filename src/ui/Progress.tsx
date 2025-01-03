import { useEffect } from 'react';
import type { PluginMessage } from '../plugin/type';

export default function Progress() {
  useEffect(() => {
    window.onmessage = (event: MessageEvent<PluginMessage>) => {
      const { type, payload } = event.data.pluginMessage;

      if (type === 'extractIcon') {
        console.log(payload);
      }
    };
  }, []);
  return <div>Progress</div>;
}
