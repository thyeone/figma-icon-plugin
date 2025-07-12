import { Progress as ProgressBar, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { PluginMessage } from '../plugin/type';
import BitbucketApi from '../shared/bitbucketApi';
import { useNavigate } from 'react-router-dom';
import { ExtractType } from './Home';

type ProgressProps = {
  username: string;
  repositoryName: string;
  bitbucketToken: string;
  exportPath: string;
  targetBranch: string;
  onError: VoidFunction;
  extractType: ExtractType;
};

const PROGRESS_TEXT = {
  30: '📂 브랜치를 생성하는 중...',
  60: '🔗 커밋을 생성하는 중...',
  85: '🚚 풀리퀘스트를 생성하는 중...',
};

const DIRECT_PROGRESS_TEXT = {
  30: '🔗 커밋을 생성하는 중...',
  60: '🚚 푸시하는 중...',
};

export default function Progress({
  extractType,
  bitbucketToken,
  username,
  repositoryName,
  exportPath,
  targetBranch,
  onError,
}: ProgressProps) {
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    window.onmessage = async (event: MessageEvent<PluginMessage>) => {
      const { type, payload } = event.data.pluginMessage;
      const bitbucketApi = new BitbucketApi(
        targetBranch,
        username,
        repositoryName,
        bitbucketToken,
        exportPath,
      );

      console.log(payload, 'payload');

      setProgress((prev) => prev + 30);

      try {
        if (extractType === ExtractType.PR) {
          const branch = await bitbucketApi.createBranch();

          setProgress((prev) => prev + 30);

          const { sourceBranch, success } =
            await bitbucketApi.createCommitWithSvg({
              branch: branch.name,
              svgs: type === 'extractIcon' ? payload.svgByName : {},
            });

          if (success) {
            setProgress((prev) => prev + 25);
            const { links } = await bitbucketApi.createPullRequest({
              sourceBranch,
            });

            if (links.html.href) {
              navigate('/success', { state: links.html.href });
            }
          }
        }

        if (extractType === ExtractType.DIRECT) {
          const { success, branchName } =
            await bitbucketApi.pushDirectlyToTargetBranch({
              svgs: type === 'extractIcon' ? payload.svgByName : {},
            });

          setProgress((prev) => prev + 30);

          if (success) {
            navigate('/success');
          }
        }
      } catch (error) {
        onError();
        console.error(error);
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
      <Text fontSize="12px">
        {extractType === ExtractType.PR
          ? PROGRESS_TEXT[progress as keyof typeof PROGRESS_TEXT]
          : DIRECT_PROGRESS_TEXT[progress as keyof typeof DIRECT_PROGRESS_TEXT]}
      </Text>
    </Stack>
  );
}
