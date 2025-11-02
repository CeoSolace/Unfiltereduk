// Privacy Policy — renders /legal/privacy.md
import { readFile } from 'fs/promises';
import { marked } from 'marked';
import { notFound } from 'next/navigation';

export default async function PrivacyPage() {
  try {
    const content = await readFile(process.cwd() + '/legal/privacy.md', 'utf8');
    const html = marked(content);
    return (
      <div className="prose prose-invert max-w-4xl mx-auto p-6">
        <h1>Privacy Policy</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  } catch {
    notFound();
  }
}
