import path from 'path';
import fs from 'fs';

/**
 * Resolves data file paths reliably in both development (ts-node) and compiled (dist) modes.
 * Checks dist/src/data/<filename> first, then falls back to src/data/<filename>.
 */
export function resolveDataPath(filename: string): string {
  // Check relative paths based on module location
  const candidatePaths = [
    path.join(__dirname, '../data', filename),
    path.join(__dirname, '../../data', filename),
    path.join(process.cwd(), 'dist', 'src', 'data', filename),
    path.join(process.cwd(), 'src', 'data', filename),
    path.join(process.cwd(), 'backend', 'dist', 'src', 'data', filename),
    path.join(process.cwd(), 'backend', 'src', 'data', filename),
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // Fallback to primary candidate if file does not exist yet (e.g. for write operations)
  return path.join(__dirname, '../data', filename);
}
