import { Button, Link, Stack, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.state;

  return (
    <Stack
      spacing={0}
      p="16px"
      alignItems="center"
      justifyContent="center"
      height="full"
    >
      <Text align="center" fontSize="sm" fontWeight={500}>
        아이콘 추출 성공!
      </Text>
      {url && (
        <Link
          fontSize="sm"
          display="flex"
          alignItems="center"
          mt="2px"
          href={url}
          color="blue.600"
          textDecoration="underline"
          textDecorationColor="blue.600"
          isExternal
        >
          PR 링크
        </Link>
      )}
      <Button size="sm" mt={6} onClick={() => navigate('/')}>
        선택 단계로
      </Button>
    </Stack>
  );
}
