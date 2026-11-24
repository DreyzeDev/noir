const API = "https://api.github.com";
const DAY = 86_400_000;
const EVENT_TYPES = new Set([
  "PushEvent",
  "PullRequestEvent",
  "PullRequestReviewEvent",
  "IssuesEvent",
  "IssueCommentEvent",
  "ReleaseEvent",
]);

export async function fetchProfileStats(login, token = process.env.GITHUB_TOKEN) {
  if (!login) throw new Error("Missing stats.username in config");

  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": `${login}-noir-stats`,
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  };

  const api = async (path) => {
    const response = await fetch(`${API}${path}`, { headers });
    if (!response.ok) throw new Error(`GET ${path} failed with ${response.status}`);
    return response.json();
  };

  const user = await api(`/users/${login}`);

  const repos = [];
  for (let page = 1; page <= 10; page += 1) {
    const chunk = await api(`/users/${login}/repos?per_page=100&page=${page}&type=owner`);
    repos.push(...chunk);
    if (chunk.length < 100) break;
  }

  const now = new Date();
  const utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const events = [];
  for (let page = 1; page <= 3; page += 1) {
    const chunk = await api(`/users/${login}/events/public?per_page=100&page=${page}`);
    events.push(...chunk);
    const oldest = chunk.at(-1);
    if (chunk.length < 100 || (oldest && Date.parse(oldest.created_at) < utcToday - 91 * DAY)) break;
  }

  const start = new Date(utcToday - 90 * DAY);
  const mondayOffset = (start.getUTCDay() + 6) % 7;
  start.setUTCDate(start.getUTCDate() - mondayOffset);
  const end = new Date(utcToday.getTime() + DAY);

  const counts = new Map();
  let updates = 0;
  for (const event of events) {
    const when = new Date(event.created_at);
    if (when < start || when >= end) continue;
    if (!EVENT_TYPES.has(event.type)) continue;
    const key = when.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
    updates += 1;
  }

  const days = [];
  for (let cursor = new Date(start); cursor <= utcToday; cursor = new Date(cursor.getTime() + DAY)) {
    days.push(cursor.toISOString().slice(0, 10));
  }

  const activeDays = days.filter((day) => counts.get(day)).length;

  return {
    login: user.login,
    repos: user.public_repos,
    followers: user.followers,
    since: new Date(user.created_at).getUTCFullYear(),
    updates,
    activeDays,
    days,
    counts: days.map((day) => counts.get(day) || 0),
    generated: utcToday.toISOString().slice(0, 10),
  };
}
