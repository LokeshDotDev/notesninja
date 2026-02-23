/**
 * Parses product description and converts bullet points and structured text into formatted blocks
 * Handles multiple formats:
 * - Line breaks (\n) as separate items
 * - Text with emojis
 * - Checkmarks and bullet points
 */

export interface DescriptionBlock {
  type: 'heading' | 'bullet' | 'text' | 'section';
  content: string;
  emoji?: string;
}

export function parseDescription(description: string): DescriptionBlock[] {
  if (!description) return [];

  const lines = description.split('\n').filter(line => line.trim());
  const blocks: DescriptionBlock[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) continue;

    // Check if line has emoji
    const emojiRegex = /^([📘🛍📝📊⏱✔💎🎯📚🔥⭐📱💻🎓🏆👨👩🎬📞✅📌🚀]) (.+)$/;
    const emojiMatch = trimmed.match(emojiRegex);

    if (emojiMatch) {
      const emoji = emojiMatch[1];
      const content = emojiMatch[2];
      blocks.push({
        type: 'bullet',
        content: content.trim(),
        emoji: emoji
      });
    } 
    // Check for checkmark (✔)
    else if (trimmed.startsWith('✔') || trimmed.startsWith('✓')) {
      blocks.push({
        type: 'bullet',
        content: trimmed.replace(/^[✔✓]\s*/, '').trim(),
        emoji: '✔'
      });
    }
    // Check for bullet-like patterns
    else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
      blocks.push({
        type: 'bullet',
        content: trimmed.replace(/^[-•*]\s*/, '').trim()
      });
    }
    // Check if line looks like a heading (all caps or ends with colon)
    else if (trimmed === trimmed.toUpperCase() || trimmed.endsWith(':')) {
      blocks.push({
        type: 'heading',
        content: trimmed.replace(/:$/, '').trim()
      });
    }
    // Regular text
    else {
      blocks.push({
        type: 'text',
        content: trimmed
      });
    }
  }

  return blocks;
}

export function formatDescriptionAsHTML(description: string): string {
  const blocks = parseDescription(description);
  
  let html = '';

  for (const block of blocks) {
    if (block.type === 'heading') {
      html += `<h3 class="text-lg font-bold mt-4 mb-2">${escapeHtml(block.content)}</h3>`;
    } else if (block.type === 'bullet') {
      if (block.emoji) {
        html += `<div class="flex items-start gap-3 mb-2"><span class="text-lg">${block.emoji}</span><span>${escapeHtml(block.content)}</span></div>`;
      } else {
        html += `<li class="ml-4 mb-1">• ${escapeHtml(block.content)}</li>`;
      }
    } else if (block.type === 'text') {
      html += `<p class="mb-3">${escapeHtml(block.content)}</p>`;
    }
  }

  return html;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
