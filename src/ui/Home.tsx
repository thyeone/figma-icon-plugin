import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Progress from './Progress';
import { PluginMessage } from '../plugin/type';

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

  const [exportPath, setExportPath] = useState('');

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setStep(Step.Processing);

    parent.postMessage({ pluginMessage: { type: 'extract' } }, '*');
  };

  useEffect(() => {
    window.onmessage = async (event: MessageEvent<PluginMessage>) => {
      const { type, payload } = event.data.pluginMessage;

      if (type === 'getToken') {
        setBitbucketToken(payload?.bitbucketToken ?? '');
      }
    };
  }, []);

  return (
    <Box p="16px">
      <Text fontSize="12px" mb="6px" mt="12px">
        Username
      </Text>
      <Input
        size="xs"
        rounded="md"
        pr="28px"
        placeholder="Enter your Bitbucket token"
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
        placeholder="Enter your Bitbucket token"
        value={repositoryName}
        onChange={(e) => setRepositoryName(e.target.value)}
      />
      <Text fontSize="12px" mb="6px" mt="12px">
        Bitbucket App Password
      </Text>
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
        defaultValue="src/components/icon"
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
          onError={() => {
            setStep(Step.Pending);
          }}
        />
      )}
    </Box>
  );
}
