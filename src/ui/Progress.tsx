import { useEffect, useState } from 'react';
import type { PluginMessage } from '../plugin/type';
import useFigmaAPI from '../shared/useFigmaApi';

type ProgressProps = {
  figmaToken: string;
  bitbucketToken: string;
};

export default function Progress({
  figmaToken,
  bitbucketToken,
}: ProgressProps) {
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  const figmaAPI = useFigmaAPI({ token: figmaToken });

  useEffect(() => {
    window.onmessage = async (event: MessageEvent<PluginMessage>) => {
      const { type, payload } = event.data.pluginMessage;

      if (type === 'extractIcon') {
        try {
          const { fileKey, ids, nodes } = payload;

          console.log(payload);

          setProgressText('🚚 피그마에서 svg를 가져오는 중...');

          const { images } = await figmaAPI.getSvg({ fileKey, ids });
        } catch (error) {}
      }
    };
  }, []);

  return <div>Progress</div>;
}
