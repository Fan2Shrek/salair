import env from '#start/env'

const BASE_URL = 'https://api.github.com'
const OWNER = 'nassimlnd'
const REPO = 'salair'

export class GithubService {
  private static headers = {
    Authorization: `Bearer ${env.get('GITHUB_TOKEN')}`,
    Accept: 'application/vnd.github.v3+json',
  }

  public static async listArticlesFiles(): Promise<string[]> {
    const response = await fetch(
      `${BASE_URL}/repos/${OWNER}/${REPO}/contents/frontend/content/articles`,
      {
        headers: this.headers,
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    return (data as any)
      .filter((f: any) => f.type === 'file' && f.name.endsWith('.md'))
      .map((f: any) => f.name.replace('.md', ''))
  }
}
