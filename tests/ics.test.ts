import { describe, expect, test } from 'bun:test';
import {
  buildInterviewEventICS,
  buildIntroCardICS,
  escapeICSText,
  foldICSLine,
} from '../src/lib/ics';

describe('escapeICSText (ported from the old app, PR #26 behaviour)', () => {
  test('escapes backslashes, semicolons and commas', () => {
    expect(escapeICSText('a\\b;c,d')).toBe('a\\\\b\\;c\\,d');
  });

  test('converts CR/LF to the literal \\n escape', () => {
    expect(escapeICSText('a\nb')).toBe('a\\nb');
    expect(escapeICSText('a\r\nb')).toBe('a\\nb');
  });

  test('a stored field cannot inject new properties or components', () => {
    const hostile = 'Name\nBEGIN:VALARM\r\nTRIGGER:-PT15M';
    const escaped = escapeICSText(hostile);
    expect(escaped).not.toContain('\n');
    expect(escaped).not.toContain('\r');
  });
});

describe('buildIntroCardICS (ported)', () => {
  const ics = buildIntroCardICS({
    fullName: 'Sam Example',
    jobTitle: 'Designer',
    company: 'Studio',
    bio: 'Bio text',
    url: 'https://b4wemeet.app/sam',
  });

  test('is a dateless VTODO with no DTSTART/DTEND anywhere', () => {
    expect(ics).toContain('BEGIN:VTODO');
    expect(ics).not.toContain('DTSTART');
    expect(ics).not.toContain('DTEND');
    expect(ics).not.toContain('BEGIN:VEVENT');
  });

  test('escapes profile fields', () => {
    const hostile = buildIntroCardICS({
      fullName: 'Evil; Name, Jr.',
      jobTitle: 'X',
      company: 'Y',
      bio: 'b',
      url: 'https://example.com',
    });
    expect(hostile).toContain('Evil\\; Name\\, Jr.');
  });
});

describe('buildInterviewEventICS (new for the pivot)', () => {
  const start = new Date('2026-11-20T15:30:00.000Z');
  const ics = buildInterviewEventICS({
    roleTitle: 'Staff Nurse',
    company: 'City Hospital',
    start,
    durationMinutes: 45,
    location: 'Ward 4',
  });

  test('uses the user-entered date, never an invented one', () => {
    expect(ics).toContain('DTSTART:20261120T153000Z');
    expect(ics).toContain('DTEND:20261120T161500Z');
    expect(ics).toContain('BEGIN:VEVENT');
  });

  test('defaults to 60 minutes', () => {
    const hour = buildInterviewEventICS({ roleTitle: 'Dev', company: '', start });
    expect(hour).toContain('DTEND:20261120T163000Z');
  });

  test('escapes summary and location', () => {
    const hostile = buildInterviewEventICS({
      roleTitle: 'A;B',
      company: 'C,D',
      start,
      location: 'Room\n5',
    });
    expect(hostile).toContain('SUMMARY:Interview: A\\;B at C\\,D');
    expect(hostile).not.toContain('Room\n5');
  });

  test('every content line is at most 75 octets after folding', () => {
    const long = buildInterviewEventICS({
      roleTitle: 'Senior Principal Distinguished Engineer of Platform Reliability and Developer Experience',
      company: 'A Very Long Company Name That Keeps Going And Going And Going',
      start,
      notes: 'x'.repeat(400),
    });
    for (const line of long.split('\r\n')) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });
});

describe('foldICSLine', () => {
  test('leaves short lines untouched', () => {
    expect(foldICSLine('SUMMARY:Hi')).toBe('SUMMARY:Hi');
  });
  test('folds long lines with CRLF + space continuations', () => {
    const folded = foldICSLine('X'.repeat(200));
    const lines = folded.split('\r\n');
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[1].startsWith(' ')).toBe(true);
  });
});
