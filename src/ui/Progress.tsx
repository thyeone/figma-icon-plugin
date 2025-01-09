import { Progress as ProgressBar, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { PluginMessage } from '../plugin/type';
import BitbucketApi from '../shared/bitbucketApi';

type ProgressProps = {
  username: string;
  repositoryName: string;
  bitbucketToken: string;
  onError: VoidFunction;
};

export default function Progress({ bitbucketToken, onError }: ProgressProps) {
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  useEffect(() => {
    window.onmessage = async (event: MessageEvent<PluginMessage>) => {
      const { type, payload } = event.data.pluginMessage;

      const bitbucketApi = new BitbucketApi();

      const response = await bitbucketApi.createBranch({
        workspace: 'diffrag',
        repoSlug: 'life',
        token: bitbucketToken,
      });

      console.log(payload, 'payload');
      console.log(response, 'response');
      console.log('213123');
    };
  }, []);

  return (
    <Stack gap="4px">
      <ProgressBar value={progress} />
      <Text fontSize="12px">{progressText}</Text>
    </Stack>
  );
}
