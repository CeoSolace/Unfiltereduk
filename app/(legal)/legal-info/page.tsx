// Legal Info — renders /legal/legal-info.md
import { readFile } from 'fs/promises';
import { marked } from 'marked';
import { notFound } from 'next/navigation';

export default async function LegalInfoPage() {
  try {
    const content = await readFile(process.cwd() + '/legal/legal-info.md', 'utf8');
    const html = marked(content);
    return (
      <div className="prose prose-invert max-w-4xl mx-auto p-6">
        <h1>Legal Information</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  } catch {
    notFound();
  }
}
