// Terms of Service page — renders /legal/tos.md
import { readFile } from 'fs/promises';
import { marked } from 'marked';
import { notFound } from 'next/navigation';

export default async function TosPage() {
  try {
    const content = await readFile(process.cwd() + '/legal/tos.md', 'utf8');
    const html = marked(content);
    return (
      <div className="prose prose-invert max-w-4xl mx-auto p-6">
        <h1>Terms of Service</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  } catch {
    notFound();
  }
}
