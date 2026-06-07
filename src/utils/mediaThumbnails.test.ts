// ============================================
// MEDIA THUMBNAILS TESTS
// ============================================

import { describe, it, expect } from 'vitest';
import { getYouTubeId, getYouTubeThumbnail, generateDocThumbnail } from './mediaThumbnails';

describe('mediaThumbnails', () => {
  describe('getYouTubeId', () => {
    it('extracts id from watch URLs', () => {
      expect(getYouTubeId('https://www.youtube.com/watch?v=FfJ5XG5i2aw')).toBe('FfJ5XG5i2aw');
    });
    it('extracts id from short and embed URLs', () => {
      expect(getYouTubeId('https://youtu.be/W6aL9YyRx1A')).toBe('W6aL9YyRx1A');
      expect(getYouTubeId('https://www.youtube.com/embed/FfJ5XG5i2aw')).toBe('FfJ5XG5i2aw');
    });
    it('returns null for non-YouTube URLs', () => {
      expect(getYouTubeId('https://example.com/video')).toBeNull();
    });
  });

  describe('getYouTubeThumbnail', () => {
    it('builds a reliable hqdefault thumbnail URL', () => {
      expect(getYouTubeThumbnail('https://www.youtube.com/watch?v=FfJ5XG5i2aw')).toBe(
        'https://img.youtube.com/vi/FfJ5XG5i2aw/hqdefault.jpg'
      );
    });
    it('returns empty string when no id is found', () => {
      expect(getYouTubeThumbnail('not a url')).toBe('');
    });
  });

  describe('generateDocThumbnail', () => {
    it('returns an inline SVG data URI (no external dependency)', () => {
      const uri = generateDocThumbnail('Matemática', 'PDF');
      expect(uri.startsWith('data:image/svg+xml')).toBe(true);
      expect(uri).toContain('SABIENCIA');
    });
    it('escapes special characters in the title', () => {
      const uri = generateDocThumbnail('A & B <test>');
      const decoded = decodeURIComponent(uri);
      expect(decoded).toContain('&amp;');
      expect(decoded).toContain('&lt;');
      expect(decoded).not.toContain('<test>');
    });
  });
});
