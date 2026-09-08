export interface DocumentChunk {
  id: string;
  sectionTitle: string;
  text: string;
  charStart: number;
  charEnd: number;
  score?: number;
}

export class DocumentChunker {
  private static STATISTICAL_KEYWORDS = new Set([
    'sample', 'sampling', 'strata', 'stratification', 'weight', 'weights', 'multiplier',
    'variance', 'standard error', 'bias', 'non-sampling', 'estimate', 'estimation',
    'schedule', 'fsu', 'ssu', 'household', 'enterprise', 'cpi', 'cfpi', 'wpi', 'gdp',
    'deflator', 'national accounts', 'gross value added', 'gva', 'nsso', 'mospi', 'asi',
    'plfs', 'index', 'laspeyres', 'paasche', 'fisher', 'base year', 'imputation',
    'non-response', 'systematic', 'pps', 'srswor', 'srswr', 'design effect', 'deff'
  ]);

  /**
   * Cleans raw extracted PDF text, normalizing hyphenations and stripping repetitive headers
   */
  public static cleanText(rawText: string): string {
    if (!rawText) return '';
    return rawText
      // Remove null bytes and control characters
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Fix hyphenated line breaks (e.g., "strati-\nfication" -> "stratification")
      .replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2')
      // Remove page number lines (e.g., "Page 12 of 150", "-- 14 --", "12 | MoSPI")
      .replace(/^\s*(?:Page\s+\d+(?:\s+of\s+\d+)?|--\s*\d+\s*--|\d+\s*\|\s*[A-Za-z\s]+)\s*$/gim, '')
      // Collapse multiple empty lines
      .replace(/\n{3,}/g, '\n\n')
      // Replace non-standard whitespace
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  /**
   * Splits text into structured, semantic chunks respecting section headings and paragraphs
   */
  public static chunkDocument(rawText: string, targetChunkSize: number = 2000, overlapSize: number = 250): DocumentChunk[] {
    const text = this.cleanText(rawText);
    if (!text) return [];

    // Detect section headers (e.g. "Chapter 1", "Section 2.1", "1.3 Sampling Design", "TABLE 4:", "ANNEXURE")
    const sectionPattern = /(?:^(?:Chapter|Section|Schedule|Annexure|Appendix|Table|Module)\s+[0-9A-ZIVX.-]+[:\s\n]|^(?:[0-9]{1,2}\.[0-9]{1,2}(?:\.[0-9]{1,2})?)\s+[A-Z][^\n]{3,60}$|^[A-Z\s]{4,50}:?$)/gm;

    const matches: { title: string; index: number }[] = [];
    let match: RegExpExecArray | null;

    while ((match = sectionPattern.exec(text)) !== null) {
      matches.push({
        title: match[0].trim().replace(/\n/g, ' '),
        index: match.index
      });
    }

    const chunks: DocumentChunk[] = [];

    // If headings were detected, create chunks along section boundaries
    if (matches.length > 1) {
      for (let i = 0; i < matches.length; i++) {
        const current = matches[i];
        const nextIndex = i < matches.length - 1 ? matches[i + 1].index : text.length;
        const sectionContent = text.substring(current.index, nextIndex).trim();

        if (sectionContent.length <= targetChunkSize + 500) {
          chunks.push({
            id: `chunk-sec-${i + 1}`,
            sectionTitle: current.title,
            text: sectionContent,
            charStart: current.index,
            charEnd: nextIndex
          });
        } else {
          // Sub-divide large section into overlapping paragraph chunks
          const subChunks = this.splitByParagraphs(sectionContent, current.title, current.index, targetChunkSize, overlapSize);
          chunks.push(...subChunks);
        }
      }
    } else {
      // Fallback to paragraph-based windowing with overlap
      const subChunks = this.splitByParagraphs(text, 'General Section', 0, targetChunkSize, overlapSize);
      chunks.push(...subChunks);
    }

    return chunks;
  }

  /**
   * Helper: Sub-divides text by paragraphs keeping sentences intact
   */
  private static splitByParagraphs(
    text: string, 
    sectionTitle: string, 
    globalOffset: number, 
    targetChunkSize: number, 
    overlapSize: number
  ): DocumentChunk[] {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const chunks: DocumentChunk[] = [];

    let currentBuffer = '';
    let currentStart = 0;
    let chunkCount = 1;

    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i].trim();
      if ((currentBuffer.length + p.length) > targetChunkSize && currentBuffer.length > 500) {
        chunks.push({
          id: `chunk-${chunks.length + 1}`,
          sectionTitle,
          text: currentBuffer.trim(),
          charStart: globalOffset + currentStart,
          charEnd: globalOffset + currentStart + currentBuffer.length
        });

        // Compute overlap by taking the last paragraph or tail slice
        const overlapText = currentBuffer.slice(-overlapSize);
        currentStart += currentBuffer.length - overlapText.length;
        currentBuffer = overlapText + '\n\n' + p;
        chunkCount++;
      } else {
        if (currentBuffer.length > 0) currentBuffer += '\n\n';
        currentBuffer += p;
      }
    }

    if (currentBuffer.trim().length > 0) {
      chunks.push({
        id: `chunk-${chunks.length + 1}`,
        sectionTitle,
        text: currentBuffer.trim(),
        charStart: globalOffset + currentStart,
        charEnd: globalOffset + currentStart + currentBuffer.length
      });
    }

    return chunks;
  }

  /**
   * Computes BM25 & keyword relevance scores and selects top candidate chunks up to totalBudgetChars
   */
  public static rankAndSelectChunks(
    chunks: DocumentChunk[], 
    queryTopic: string = '', 
    totalBudgetChars: number = 4500
  ): DocumentChunk[] {
    if (chunks.length === 0) return [];

    const queryTokens = queryTopic.toLowerCase().split(/\W+/).filter(t => t.length > 2);
    const totalDocs = chunks.length;

    // 1. Calculate Document Frequencies
    const dfMap = new Map<string, number>();
    for (const chunk of chunks) {
      const uniqueWords = new Set(chunk.text.toLowerCase().split(/\W+/).filter(t => t.length > 2));
      for (const word of uniqueWords) {
        dfMap.set(word, (dfMap.get(word) || 0) + 1);
      }
    }

    // 2. Score each chunk using BM25-inspired term density and statistical keyword bonus
    const avgDocLength = chunks.reduce((acc, c) => acc + c.text.length, 0) / totalDocs;
    const k1 = 1.2;
    const b = 0.75;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const docWords = chunk.text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
      const docLength = chunk.text.length;
      let score = 0;

      // Query term BM25 matching
      for (const token of queryTokens) {
        const tf = docWords.filter(w => w === token || w.includes(token)).length;
        if (tf > 0) {
          const df = dfMap.get(token) || 1;
          const idf = Math.log((totalDocs - df + 0.5) / (df + 0.5) + 1);
          const termScore = idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (docLength / avgDocLength))));
          score += termScore * 3.0; // Higher weight for user-specified topic match
        }
      }

      // Statistical domain keyword density bonus
      let statKeywordCount = 0;
      for (const word of docWords) {
        if (this.STATISTICAL_KEYWORDS.has(word)) {
          statKeywordCount++;
        }
      }
      const keywordDensity = statKeywordCount / Math.max(docWords.length, 1);
      score += keywordDensity * 50.0;

      // Position spread bonus (rewards having chunks from different sections of the document)
      const positionRatio = i / Math.max(totalDocs - 1, 1);
      const spreadBonus = Math.sin(positionRatio * Math.PI) * 2.0; // parabolic bonus for body/methodology sections
      score += spreadBonus;

      chunk.score = score;
    }

    // 3. Sort chunks descending by score
    const sorted = [...chunks].sort((a, b) => (b.score || 0) - (a.score || 0));

    // 4. Greedily assemble chunks within budget, maintaining original document sequence
    const selected: DocumentChunk[] = [];
    let currentLength = 0;

    for (const chunk of sorted) {
      if (currentLength + chunk.text.length <= totalBudgetChars || selected.length === 0) {
        selected.push(chunk);
        currentLength += chunk.text.length;
      }
    }

    // Sort selected chunks by original document charStart to preserve narrative flow
    return selected.sort((a, b) => a.charStart - b.charStart);
  }

  /**
   * Format selected chunks into structured XML context for LLM prompt
   */
  public static formatChunksForPrompt(chunks: DocumentChunk[]): string {
    return chunks.map((chunk, idx) => {
      return `<section_chunk index="${idx + 1}" title="${chunk.sectionTitle}">\n${chunk.text}\n</section_chunk>`;
    }).join('\n\n');
  }
}
