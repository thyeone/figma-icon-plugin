type BitbucketUser = {
  display_name: string;
  links: {
    self: { href: string };
    avatar: { href: string };
    html: { href: string };
  };
  type: 'user';
  uuid: string;
  account_id: string;
  nickname: string;
};

type BitbucketRepository = {
  type: 'repository';
  full_name: string;
  links: {
    self: { href: string };
    html: { href: string };
    avatar: { href: string };
  };
  name: string;
  uuid: string;
};

type BitbucketBranch = {
  name: string;
  links: Record<string, unknown>;
  sync_strategies?: ['merge_commit', 'rebase'];
};

type BitbucketCommit = {
  hash: string;
  links: {
    self: { href: string };
    html: { href: string };
  };
  type: 'commit';
};

type BitbucketRendered = {
  type: 'rendered';
  raw: string;
  markup: 'markdown';
  html: string;
};

export type BitbucketPullRequest = {
  comment_count: number;
  task_count: number;
  type: 'pullrequest';
  id: number;
  title: string;
  description: string;
  rendered: {
    title: BitbucketRendered;
    description: BitbucketRendered;
  };
  state: 'OPEN' | 'MERGED' | 'DECLINED' | 'SUPERSEDED';
  merge_commit: string | null;
  close_source_branch: boolean;
  closed_by: BitbucketUser | null;
  author: BitbucketUser;
  reason: string;
  created_on: string;
  updated_on: string;
  destination: {
    branch: BitbucketBranch;
    commit: BitbucketCommit;
    repository: BitbucketRepository;
  };
  source: {
    branch: BitbucketBranch;
    commit: BitbucketCommit;
    repository: BitbucketRepository;
  };
  reviewers: BitbucketUser[];
  participants: BitbucketUser[];
  links: {
    self: { href: string };
    html: { href: string };
    commits: { href: string };
    approve: { href: string };
    'request-changes': { href: string };
    diff: { href: string };
    diffstat: { href: string };
    comments: { href: string };
    activity: { href: string };
    merge: { href: string };
    decline: { href: string };
    statuses: { href: string };
  };
  summary: BitbucketRendered;
};
