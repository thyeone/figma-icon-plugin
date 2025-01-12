import { InfoIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
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
  const [step, setStep] = useState(Step.Pending);
  const [isError, setIsError] = useState(false);

  const [exportPath, setExportPath] = useState('');

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
      }
    };
  }, []);

  useEffect(() => {
    if (isError) {
      toast({
        title: '에러가 발생했어요.',
        position: 'top',
        status: 'error',
      });
    }
  }, [isError]);

  return (
    <Box p="16px">
      <HStack align="center" gap="4px" mb="6px" mt="12px">
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
      <Text fontSize="12px" mb="6px" mt="12px">
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
      <HStack align="center" gap="4px" mb="6px" mt="12px">
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
      <Text fontSize="12px" mb="6px" mt="12px">
        추출할 경로
      </Text>
      <Input
        type="text"
        value={exportPath}
        size="xs"
        rounded="md"
        onChange={(e) => setExportPath(e.target.value)}
      />
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
          onError={() => {
            setStep(Step.Pending);
            setIsError(true);
          }}
        />
      )}
    </Box>
  );
}

function HelpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height={24}
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm-4.3 304c-11.8 0-21.4-9-21.4-20.6 0-11.5 9.6-20.6 21.4-20.6 11.9 0 21.5 9 21.5 20.6 0 11.6-9.5 20.6-21.5 20.6zm40.2-96.9c-17.4 10.1-23.3 17.5-23.3 30.3v7.9h-34.7l-.3-8.6c-1.7-20.6 5.5-33.4 23.6-44 16.9-10.1 24-16.5 24-28.9s-12-21.5-26.9-21.5c-15.1 0-26 9.8-26.8 24.6H192c.7-32.2 24.5-55 64.7-55 37.5 0 63.3 20.8 63.3 50.7 0 19.9-9.6 33.6-28.1 44.5z"></path>
    </svg>
  );
}
