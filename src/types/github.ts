interface GithubLanguage {
    name: string;
    color: string | null;
}

interface GithubLanguageEdge {
    size: number;
    node: GithubLanguage;
}

interface GithubLanguages {
    edges: GithubLanguageEdge[];
}

interface GithubCommitNode {
    message: string;
    committedDate: string;
}

interface GithubCommitHistory {
    totalCount: number;
    nodes: GithubCommitNode[];
}

interface GithubCommit {
    history: GithubCommitHistory;
}

interface GithubDefaultBranchRef {
    target: GithubCommit;
}

interface GithubRepository {
    name: string;
    description: string | null;
    url: string;
    stargazerCount: number;
    forkCount: number;
    isPrivate: boolean;
    primaryLanguage: GithubLanguage | null;
    languages: GithubLanguages;
    defaultBranchRef: GithubDefaultBranchRef | null; // can be null (e.g. empty repo, no commits)
}

interface GithubRepositories {
    totalCount: number;
    nodes: GithubRepository[];
}

interface GithubContributionCalendar {
    totalContributions: number;
}

interface GithubContributionsCollection {
    totalCommitContributions: number;
    totalPullRequestContributions: number;
    totalRepositoriesWithContributedCommits: number;
    contributionCalendar: GithubContributionCalendar;
}

interface GithubUser {
    login: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    repositories: GithubRepositories;
    contributionsCollection: GithubContributionsCollection;
}

export interface GithubGraphQLResponse {
    data: {
        user: GithubUser | null;
    };
}