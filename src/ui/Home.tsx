import { InfoIcon, ViewIcon, ViewOffIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { PluginMessage } from '../plugin/type';
import Progress from './Progress';

enum Step {
  Pending,
  Processing,
  Resolved,
}

export default function Home() {
  const [isBitbucketVisible, setIsBitbucketVisible] = useState(false);

  const [bitbucketToken, setBitbucketToken] = useState('');
  const [username, setUsername] = useState('');
  const [repositoryName, setRepositoryName] = useState('');
  const [exportPath, setExportPath] = useState('');
  const [targetBranch, setTargetBranch] = useState('main');

  const [step, setStep] = useState(Step.Pending);
  const [isError, setIsError] = useState(false);

  const toast = useToast({
    containerStyle: {
      mx: 'auto',
      maxW: '280px',
    },
  });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsError(false);
    setStep(Step.Processing);

    parent.postMessage({ pluginMessage: { type: 'extract' } }, '*');

    parent.postMessage(
      {
        pluginMessage: {
          type: 'setToken',
          payload: {
            username,
            repositoryName,
            bitbucketToken,
            exportPath,
          },
        },
      },
      '*',
    );
  };

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: 'getToken' } }, '*');
  }, []);

  useEffect(() => {
    window.onmessage = async (event: MessageEvent<PluginMessage>) => {
      const { type, payload } = event.data.pluginMessage;

      if (type === 'getToken') {
        setBitbucketToken(payload?.bitbucketToken ?? '');
        setExportPath(payload?.exportPath ?? '');
        setUsername(payload?.username ?? '');
        setRepositoryName(payload?.repositoryName ?? '');
        setTargetBranch(payload?.targetBranch ?? 'main');
      }
    };
  }, []);

  useEffect(() => {
    if (isError) {
      toast({
        title: '에러가 발생했어요.',
        position: 'top',
        status: 'error',
        render: () => (
          <Flex
            align="center"
            h="36px"
            px="16px"
            backgroundColor="red.500"
            rounded="md"
            gap="4px"
            w="100%"
            maxW="230px"
            position="fixed"
            top="8px"
            mx="auto"
            insetX={0}
          >
            <WarningIcon fontSize="12px" color="white" />
            <Text fontSize="12px" fontWeight="medium" color="white">
              에러가 발생했어요.
            </Text>
          </Flex>
        ),
      });
    }
  }, [isError]);

  return (
    <Box p="16px">
      <HStack align="center" gap="4px" mb="4px" mt="12px">
        <Text fontSize="12px">Bitbucket Username</Text>
        <Tooltip
          label="Bitbucket 상단 톱니바퀴 > Personal Bitbucket settings 에서 확인할 수 있습니다"
          maxW="240px"
          mx="auto"
          fontSize="12px"
        >
          <InfoIcon fontSize="12px" color="#8595A0" />
        </Tooltip>
      </HStack>
      <Input
        size="xs"
        rounded="md"
        pr="28px"
        placeholder="Enter your Bitbucket Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Text fontSize="12px" mb="4px" mt="12px">
        Repository Name
      </Text>
      <Input
        size="xs"
        rounded="md"
        pr="28px"
        placeholder="Enter your Bitbucket Repository Name"
        value={repositoryName}
        onChange={(e) => setRepositoryName(e.target.value)}
      />
      <HStack align="center" gap="4px" mb="4px" mt="12px">
        <Text fontSize="12px">Bitbucket App Password</Text>
        <Tooltip
          label="Personal Bitbucket settings > App Password 에서 확인할 수 있습니다"
          maxW="240px"
          mx="auto"
          fontSize="12px"
        >
          <InfoIcon fontSize="12px" color="#8595A0" />
        </Tooltip>
      </HStack>
      <Box position="relative">
        <Input
          type={isBitbucketVisible ? 'text' : 'password'}
          size="xs"
          rounded="md"
          pr="28px"
          placeholder="Enter your Bitbucket token"
          value={bitbucketToken}
          onChange={(e) => setBitbucketToken(e.target.value)}
        />

        {isBitbucketVisible ? (
          <ViewIcon
            position="absolute"
            right="8px"
            top="50%"
            transform="translateY(-50%)"
            cursor="pointer"
            onClick={() => setIsBitbucketVisible(false)}
          />
        ) : (
          <ViewOffIcon
            position="absolute"
            right="8px"
            top="50%"
            transform="translateY(-50%)"
            cursor="pointer"
            onClick={() => setIsBitbucketVisible(true)}
          />
        )}
      </Box>
      <Text fontSize="12px" mb="4px" mt="12px">
        추출할 경로
      </Text>
      <Input
        type="text"
        value={exportPath}
        size="xs"
        rounded="md"
        onChange={(e) => setExportPath(e.target.value)}
      />
      <HStack align="center" gap="4px" mb="4px" mt="12px">
        <Text fontSize="12px">타켓 브랜치</Text>
        <Tooltip label="기본값: main" maxW="240px" mx="auto" fontSize="12px">
          <InfoIcon fontSize="12px" color="#8595A0" />
        </Tooltip>
      </HStack>
      <Input
        type="text"
        value={targetBranch}
        size="xs"
        rounded="md"
        onChange={(e) => setTargetBranch(e.target.value)}
      />
      <Text fontSize="12px" mt="6px" color="gray.500">
        입력한 모든 값들은 추출 후 로컬 스토리지에 저장됩니다.
      </Text>
      {step === Step.Pending && (
        <Flex justify="flex-end" mt="12px">
          <Button
            type="button"
            size="xs"
            colorScheme="blue"
            onClick={handleSubmit}
          >
            추출하기
          </Button>
        </Flex>
      )}
      {step === Step.Processing && (
        <Progress
          bitbucketToken={bitbucketToken}
          username={username}
          repositoryName={repositoryName}
          exportPath={exportPath}
          targetBranch={targetBranch}
          onError={() => {
            setStep(Step.Pending);
            setIsError(true);
          }}
        />
      )}
    </Box>
  );
}
