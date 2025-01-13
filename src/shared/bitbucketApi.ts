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
  sourceBranch: string;
  title?: string;
  description?: string;
};

class BitbucketApi {
  private readonly workspace: string = 'diffrag';
  private readonly branch: string = `svg/${dayjs().format(
    'YYYY-MM-DD-HHmmss',
  )}`;

  constructor(
    private readonly targetBranch: string,
    private readonly username: string,
    private readonly repositoryName: string,
    private readonly token: string,
    private readonly exportPath: string = 'public/svgs',
  ) {}

  private formatFileName(id: string): string {
    return `${id.replace('=', '-')}.svg`;
  }

  public async createBranch(): Promise<{
    name: string;
  }> {
    const response = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${this.workspace}/${this.repositoryName}/refs/branches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${this.username}:${this.token}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.branch,
          target: {
            hash: this.targetBranch,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to create branch');
    }

    return await response.json();
  }

  public async createCommitWithSvg({
    branch,
    svgs,
  }: Pick<CreateCommitParams, 'svgs' | 'branch'>): Promise<{
    sourceBranch: string;
    success: boolean;
  }> {
    const formData = new FormData();
    formData.append('branch', branch);
    formData.append('message', 'svg 생성');

    for (const [filename, data] of Object.entries(svgs)) {
      const fileName = this.formatFileName(filename);
      const fullPath = `${this.exportPath}/${fileName}`;

      try {
        const blob = new Blob([data.svg], { type: 'image/svg+xml' });
        formData.append(fullPath, blob, fileName);
      } catch (error) {
        console.error(`Error processing file ${fileName}:`, error);
      }
    }

    const commitResponse = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${this.workspace}/${this.repositoryName}/src`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${this.username}:${this.token}`)}`,
        },
        body: formData,
      },
    );

    return {
      sourceBranch: this.branch,
      success: commitResponse.ok,
    };
  }

  public async createPullRequest({
    sourceBranch,
    title = `피그마에서 SVG 파일 추출 ${dayjs().format('YYYY-MM-DD-H:mm')}`,
    description = `피그마에서 SVG 파일 추출 ${dayjs().format(
      'YYYY-MM-DD-H:mm',
    )}`,
  }: CreatePullRequestParams): Promise<BitbucketPullRequest> {
    const response = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${this.workspace}/${this.repositoryName}/pullrequests`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${this.username}:${this.token}`)}`,
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
              name: this.targetBranch,
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to create pull request');
    }

    return await response.json();
  }
}

export default BitbucketApi;
