import type { CSSProperties } from 'react';
import { Github, ArrowUpRight } from 'lucide-react';
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
      .slice(0, 5);
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
      <section id="github" className={styles.section} aria-label="GitHub">
        <div className={styles.fallback}>
          GitHub stats are temporarily unavailable. Visit my profile directly below.
        </div>
        <a className={styles.cta} href={profile.links.github} target="_blank" rel="noreferrer">
          <Github size={14} /> @{USERNAME} on GitHub <ArrowUpRight />
        </a>
      </section>
    );
  }

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const years = yearsOnGitHub(user.created_at);

  return (
    <section id="github" className={styles.section} aria-label="GitHub">
      {/* Stat-Led hero: one giant number does the work. */}
      <div className={styles.statHero}>
        <div className={styles.figure}>
          {user.public_repos}
          <span>repos</span>
        </div>
        <div>
          <p className={styles.qualifier}>
            <strong>{user.public_repos} public repositories</strong> over {years} years on GitHub —
            cybersecurity tooling, AI agents, data pipelines, and the occasional web build. Everything below
            comes straight from the GitHub API at build time, no fabricated stars.
          </p>
          <a className={styles.cta} href={profile.links.github} target="_blank" rel="noreferrer">
            <Github size={12} /> @{USERNAME} <ArrowUpRight />
          </a>
        </div>
      </div>

      {/* Supporting stats — tabular, no boxes. */}
      <div className={styles.support}>
        <div>
          <span className={styles.supportFigure}>{user.followers}</span>
          <span className={styles.supportLabel}>Followers</span>
        </div>
        <div>
          <span className={styles.supportFigure}>{totalStars}</span>
          <span className={styles.supportLabel}>Stars on top 5</span>
        </div>
        <div>
          <span className={styles.supportFigure}>{years}y</span>
          <span className={styles.supportLabel}>On GitHub</span>
        </div>
      </div>

      {/* Top repos as a dense list, no cards. */}
      {repos.length > 0 && (
        <div className={styles.repoSection}>
          <div>
            <h3 className={styles.repoLabel}>Top five.</h3>
            <div className={styles.repoSub}>By star count.</div>
          </div>
          <ul className={styles.repoList}>
            {repos.map((repo) => {
              const brand = repo.language ? LANG_COLORS[repo.language] ?? '#ff7b32' : '#666';
              return (
                <li key={repo.id}>
                  <a
                    className={styles.repoItem}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ '--repoBrand': brand } as CSSProperties}
                  >
                    <span className={styles.repoName}>{repo.name}</span>
                    <p className={styles.repoDesc}>{repo.description ?? 'No description.'}</p>
                    <div className={styles.repoMeta}>
                      {repo.language && <span className={styles.repoLang}>{repo.language}</span>}
                      <span>★ {repo.stargazers_count} · ⑂ {repo.forks_count}</span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
