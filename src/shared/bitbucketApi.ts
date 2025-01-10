import dayjs from 'dayjs';
import type { SvgByName } from '../plugin/type';
import type { BitbucketPullRequest } from './bitbucket.type';

type createBranchParams = {
  repositoryName: string;
  username: string;
  branch?: string;
  token: string;
};

type CreateCommitParams = {
  repositoryName: string;
  username: string;
  branch: string;
  token: string;
  svgs: SvgByName;
  exportPath: string;
};

type CreatePullRequestParams = {
  repositoryName: string;
  username: string;
  sourceBranch: string;
  title?: string;
  description?: string;
  token: string;
};

class BitbucketApi {
  private workspace: string = 'diffrag';

  private formatFileName(id: string): string {
    return `${id.replace('=', '-')}.svg`;
  }

  public async createBranch({
    repositoryName,
    username,
    branch = `svg/${dayjs().format('YYYY-MM-DD-HHmmss')}`,
    token,
  }: createBranchParams): Promise<{ name: string }> {
    const response = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${this.workspace}/${repositoryName}/refs/branches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${username}:${token}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: branch,
          target: {
            hash: 'main',
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to create branch');
    }

    const data = await response.json();

    return data;
  }

  public async createCommitWithSvg({
    repositoryName,
    exportPath,
    username,
    branch,
    token,
    svgs,
  }: CreateCommitParams): Promise<{
    sourceBranch: string;
    success: boolean;
  }> {
    const formData = new FormData();
    formData.append('branch', branch);
    formData.append('message', 'svg 생성');

    // svgFiles 객체 생성과 formData 추가를 한번에 처리
    for (const [filename, data] of Object.entries(svgs)) {
      const fileName = this.formatFileName(filename);
      const fullPath = exportPath
        ? `${exportPath}/${fileName}`
        : `public/svgs/${fileName}`;

      try {
        const blob = new Blob([data.svg], { type: 'image/svg+xml' });
        formData.append(fullPath, blob, fileName);
      } catch (error) {
        console.error(`Error processing file ${fileName}:`, error);
      }
    }
    const commitResponse = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${this.workspace}/${repositoryName}/src`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${username}:${token}`)}`,
        },
        body: formData,
      },
    );

    return {
      sourceBranch: branch,
      success: commitResponse.ok,
    };
  }

  public async createPullRequest({
    repositoryName,
    username,
    token,
    sourceBranch,
    title = `피그마에서 SVG 파일 추출 ${dayjs().format('YYYY-MM-DD-H:mm')}`,
    description = `피그마에서 SVG 파일 추출 ${dayjs().format(
      'YYYY-MM-DD-H:mm',
    )}`,
  }: CreatePullRequestParams): Promise<BitbucketPullRequest> {
    const response = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${this.workspace}/${repositoryName}/pullrequests`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${username}:${token}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          source: {
            branch: {
              name: sourceBranch,
            },
          },
          destination: {
            branch: {
              name: 'main',
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to create pull request');
    }

    const data = await response.json();
    return data;
  }
}

export default BitbucketApi;
