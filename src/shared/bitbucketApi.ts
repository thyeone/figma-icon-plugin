type createBranchParams = {
  workspace: string;
  repoSlug: string;
  branch?: string;
  token: string;
};

class BitbucketApi {
  public async createBranch({
    workspace,
    repoSlug,
    branch = `svg/${Date.now()}`,
    token,
  }: createBranchParams) {
    const response = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/refs/branches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic dGhraW03OkFUQkJmMks3SnRKbnpVNG5VZVVwdmg1aFdNblBGMDgyNEVCQg==`,
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
}

export default BitbucketApi;
