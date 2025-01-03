import { useCallback, useMemo } from 'react';
import { Bitbucket } from 'bitbucket';
import type { Schema } from 'bitbucket/src/types';

interface UseBitbucketAPIProps {
  auth: string;
  workspace: string;
  repo: string;
}

function useBitbucketAPI({ auth, workspace, repo }: UseBitbucketAPIProps) {
  const bitbucket = useMemo(
    () =>
      new Bitbucket({
        auth: {
          token: auth,
        },
      }),
    [auth],
  );

  const getBranch = useCallback(
    async (branchName: string) => {
      const { data } = await bitbucket.refs.getBranch({
        workspace,
        repo_slug: repo,
        name: branchName,
      });
      return data;
    },
    [bitbucket, workspace, repo],
  );

  const createCommit = useCallback(
    async (params: {
      branch: string;
      message: string;
      files: { path: string; content: string }[];
    }) => {
      const { data } = await bitbucket.repositories.createSrcFileCommit({
        workspace,
        repo_slug: repo,
        branch: params.branch,
        message: params.message,
        files: params.files.reduce((acc, file) => {
          acc[file.path] = {
            content: file.content,
          };
          return acc;
        }, {} as Record<string, { content: string }>),
      });
      return data;
    },
    [bitbucket, workspace, repo],
  );

  const createBranch = useCallback(
    async (params: { name: string; target: { hash: string } }) => {
      const { data } = await bitbucket.refs.createBranch({
        workspace,
        repo_slug: repo,
        _body: {
          name: params.name,
          target: {
            hash: params.target.hash,
          },
        },
      });
      return data;
    },
    [bitbucket, workspace, repo],
  );

  const createPullRequest = useCallback(
    async (params: {
      title: string;
      description: string;
      source: { branch: { name: string } };
      destination: { branch: { name: string } };
    }) => {
      const { data } = await bitbucket.pullrequests.create({
        workspace,
        repo_slug: repo,
        _body: {
          title: params.title,
          description: params.description,
          source: {
            branch: {
              name: params.source.branch.name,
            },
          },
          destination: {
            branch: {
              name: params.destination.branch.name,
            },
          },
        },
      });
      return data;
    },
    [bitbucket, workspace, repo],
  );

  return {
    getBranch,
    createCommit,
    createBranch,
    createPullRequest,
  };
}

export default useBitbucketAPI;
