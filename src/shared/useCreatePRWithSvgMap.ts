import { useCallback } from 'react';
import useBitbucketAPI from './useBitbucket';
import config from '../config';
import { SvgByName } from '../plugin/type';

export function useCreatePRWithSvgMap({
  bitbucketToken,
}: {
  bitbucketToken: string;
}) {
  const bitbucketAPI = useBitbucketAPI({
    auth: bitbucketToken,
    workspace: config.repository.owner,
    repo: config.repository.name,
  });

  const getMainBranch = useCallback(
    (branchName: string) => async () => bitbucketAPI.getBranch(branchName),
    [bitbucketAPI],
  );

  const createCommit = useCallback(
    (svgByName: SvgByName, baseBranchSha: string) => async () => {
      const blob = await bitbucketAPI.createGitBlob(JSON.stringify(svgByName));
      const tree = await bitbucketAPI.createGitTree({
        baseTreeSha: baseBranchSha,
        tree: [
          {
            sha: blob.sha,
            path: 'icons.json',
            type: 'blob',
            mode: '100644',
          },
        ],
      });
      const commit = await githubAPI.createGitCommit({
        message: 'feat(bezier-icons): add icons.json file',
        tree: tree.sha,
        parents: [baseBranchSha],
        author: {
          ...config.commit.author,
          date: new Date().toISOString(),
        },
      });

      return commit;
    },
    [githubAPI],
  );

  const createPullRequest = useCallback(
    (commitSha: string) => async () => {
      /**
       * NOTE: this branch name is used in ./github/workflows/generate-icon-files.yml
       */
      const newBranchName = `icon-update-${new Date().getTime()}`;

      await githubAPI.createGitRef({
        branchName: newBranchName,
        sha: commitSha,
      });

      const pr = await githubAPI.createPullRequest({
        title: config.pr.title,
        body: config.pr.body,
        head: newBranchName,
        base: config.repository.baseBranchName,
      });

      await githubAPI.addLabels({
        issueNumber: pr.number,
        labels: config.pr.labels,
      });

      return pr;
    },
    [githubAPI],
  );

  const createPRWithSvgMap = useCallback(
    async (svgByName: SvgByName) => {
      const baseBranch = await progress({
        callback: getMainBranch(config.repository.baseBranchName),
        title: '📦 깃헙에서 정보를 가져오는 중...',
        successValueOffset: 0.3,
      });

      const commit = await progress({
        callback: createCommit(svgByName, baseBranch.sha),
        title: '🎨 베지어 아이콘 변경사항을 반영하는 중...',
        successValueOffset: 0.3,
      });

      const pr = await progress({
        callback: createPullRequest(commit.sha),
        title: '🚚 깃헙에 Pull request를 만드는 중...',
        successValueOffset: 0.4,
      });

      return pr.html_url;
    },
    [createCommit, createPullRequest, getMainBranch, progress],
  );

  return createPRWithSvgMap;
}
