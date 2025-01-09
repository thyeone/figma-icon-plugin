import { Progress as ProgressBar, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { PluginMessage } from '../plugin/type';
import BitbucketApi from '../shared/bitbucketApi';
import { useNavigate } from 'react-router-dom';

type ProgressProps = {
  username: string;
  repositoryName: string;
  bitbucketToken: string;
  onError: VoidFunction;
};

const PROGRESS_TEXT = {
  30: '📂 브랜치를 생성하는 중...',
  60: '🔗 커밋을 생성하는 중...',
  85: '🚚 풀리퀘스트를 생성하는 중...',
};

export default function Progress({
  bitbucketToken,
  username,
  repositoryName,
  onError,
}: ProgressProps) {
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    window.onmessage = async (event: MessageEvent<PluginMessage>) => {
      const { type, payload } = event.data.pluginMessage;
      const bitbucketApi = new BitbucketApi();

      setProgress((prev) => prev + 30);

      try {
        const branch = await bitbucketApi.createBranch({
          repositoryName,
          token: bitbucketToken,
          username,
        });

        setProgress((prev) => prev + 30);

        const { sourceBranch, success } =
          await bitbucketApi.createCommitWithSvg({
            repositoryName,
            token: bitbucketToken,
            username,
            branch: branch.name,
            svgs: type === 'extractIcon' ? payload.svgByName : {},
          });

        if (success) {
          setProgress((prev) => prev + 25);
          const { links } = await bitbucketApi.createPullRequest({
            repositoryName,
            token: bitbucketToken,
            username,
            sourceBranch,
          });

          if (links.html.href) {
            navigate('/success', { state: links.html.href });
          }
        }
      } catch (error) {
        onError();
      }
    };
  }, []);

  return (
    <Stack gap="4px" mt="12px">
      <ProgressBar
        value={progress}
        height="6px"
        colorScheme="green"
        rounded="sm"
      />
      <Text fontSize="12px">{PROGRESS_TEXT[progress]}</Text>
    </Stack>
  );
}
