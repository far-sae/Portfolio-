import { Github, Star, GitFork } from 'lucide-react';
import profile from '@/data/profile.json';
import styles from './GitHubStats.module.css';

const USERNAME = 'far-sae';

type User = {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3776AB',
  Go: '#00ADD8',
  Rust: '#DEA584',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Shell: '#89E051',
  Java: '#B07219',
  C: '#555555',
  'C++': '#F34B7D',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
};

async function fetchUser(): Promise<User | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${USERNAME}`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as User;
  } catch {
    return null;
  }
}

async function fetchRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner&sort=updated`,
      {
        next: { revalidate: 3600 },
        headers: { Accept: 'application/vnd.github+json' },
      }
    );
    if (!res.ok) return [];
    const repos = (await res.json()) as Repo[];
    return repos
      .filter((r) => !r.fork && !r.archived && r.name !== USERNAME)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);
  } catch {
    return [];
  }
}

function yearsOnGitHub(createdAt: string): number {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return Math.max(1, Math.round((now - created) / (365.25 * 24 * 60 * 60 * 1000)));
}

export default async function GitHubStats() {
  const [user, repos] = await Promise.all([fetchUser(), fetchRepos()]);

  if (!user) {
    return (
      <section id="github" className={styles.section} aria-label="GitHub activity">
        <p className={styles.eyebrow}>Open source</p>
        <h2 className={styles.heading}>Things I push.</h2>
        <div className={styles.fallback}>
          GitHub stats are temporarily unavailable. Visit my profile directly below.
        </div>
        <a className={styles.cta} href={profile.links.github} target="_blank" rel="noreferrer">
          <Github />
          @{USERNAME} on GitHub
        </a>
      </section>
    );
  }

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

  return (
    <section id="github" className={styles.section} aria-label="GitHub activity">
      <p className={styles.eyebrow}>Open source</p>
      <h2 className={styles.heading}>Things I push.</h2>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{user.public_repos}</div>
          <div className={styles.statLabel}>Public repos</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{user.followers}</div>
          <div className={styles.statLabel}>Followers</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{totalStars}</div>
          <div className={styles.statLabel}>Stars earned</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{yearsOnGitHub(user.created_at)}y</div>
          <div className={styles.statLabel}>On GitHub</div>
        </div>
      </div>

      {repos.length > 0 && (
        <>
          <p className={styles.reposLabel}>Most-starred recent repos</p>
          <div className={styles.repos}>
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className={styles.repoCard}
              >
                <h3 className={styles.repoName}>{repo.name}</h3>
                <p className={styles.repoDesc}>{repo.description ?? 'No description.'}</p>
                <div className={styles.repoMeta}>
                  {repo.language && (
                    <span>
                      <span
                        className={styles.langDot}
                        style={{ background: LANG_COLORS[repo.language] ?? 'var(--orange)' }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span>
                    <Star size={12} /> {repo.stargazers_count}
                  </span>
                  <span>
                    <GitFork size={12} /> {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      <a className={styles.cta} href={profile.links.github} target="_blank" rel="noreferrer">
        <Github />
        @{USERNAME} on GitHub
      </a>
    </section>
  );
}
