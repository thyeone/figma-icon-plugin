import { Progress as ProgressBar, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { PluginMessage } from '../plugin/type';

type ProgressProps = {
  figmaToken: string;
  bitbucketToken: string;
  onError: VoidFunction;
};

export default function Progress({
  figmaToken,
  bitbucketToken,
  onError,
}: ProgressProps) {
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  useEffect(() => {
    window.onmessage = async (event: MessageEvent<PluginMessage>) => {
      const { type, payload } = event.data.pluginMessage;

      console.log(payload, 'payload');
    };
  }, []);

  return (
    <Stack gap="4px">
      <ProgressBar value={progress} />
      <Text fontSize="12px">{progressText}</Text>
    </Stack>
  );
}
