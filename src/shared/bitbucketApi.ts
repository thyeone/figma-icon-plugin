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
    return `public/svgs/${id.replace('=', '-')}.svg`;
  }

  private convertSvgDataToString(svgData: Uint8Array): string {
    return String.fromCharCode(...Array.from(svgData));
  }

  public async createBranch({
    repositoryName,
    username,
    branch = `svg/${dayjs().format('YYYY-MM-DD-HHmm')}`,
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
    username,
    branch,
    token,
    svgs,
  }: CreateCommitParams): Promise<{
    sourceBranch: string;
    success: boolean;
  }> {
    /**
     * key: svg 파일이름
     * value: svg 코드
     */
    const svgFiles: { [key: string]: string } = {};

    for (const [filename, data] of Object.entries(svgs)) {
      const fileName = this.formatFileName(filename);
      const svgString = this.convertSvgDataToString(data.svg);
      svgFiles[fileName] = svgString;
    }

    const formData = new FormData();

    formData.append('branch', branch);
    formData.append('message', 'svg 생성');

    Object.entries(svgFiles).forEach(([filename, svgContent]) => {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      formData.append(filename, blob, filename);
    });

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
