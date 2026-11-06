import { describe, expect, test } from 'bun:test';
import { buildBackup, serializeBackup, validateBackupText } from '../src/tool/backup';
import { emptyWorkspace, type Workspace } from '../src/tool/types';

const sample = (): Workspace => {
  const ws = emptyWorkspace();
  ws.stories.push({
    id: 's1',
    title: 'Outage save',
    situation: 'S',
    task: 'T',
    action: 'A',
    result: 'R',
    tags: ['pressure'],
    createdAt: '2026-11-01T00:00:00.000Z',
    updatedAt: '2026-11-01T00:00:00.000Z',
  });
  ws.packs.push({
    id: 'p1',
    roleTitle: 'Nurse',
    company: 'Hospital',
    type: 'panel',
    dateTime: '2026-11-20T09:00',
    location: '',
    questions: [{ question: 'Why nursing?', notes: '', storyId: 's1' }],
    asks: [{ question: 'What are ratios like?', notes: '' }],
    pitchOverride: '',
    researchNotes: '',
    debrief: '',
    archived: false,
    createdAt: '2026-11-01T00:00:00.000Z',
    updatedAt: '2026-11-01T00:00:00.000Z',
  });
  ws.pitch = { present: 'Now', past: 'Then', future: 'Next' };
  return ws;
};

describe('backup round trip', () => {
  test('a serialized backup validates back to the same data', () => {
    const ws = sample();
    const result = validateBackupText(serializeBackup(ws));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.workspace.stories).toHaveLength(1);
      expect(result.workspace.packs[0].questions[0].storyId).toBe('s1');
      expect(result.workspace.pitch.present).toBe('Now');
    }
  });

  test('backup carries the privacy warning', () => {
    expect(buildBackup(sample()).warning).toContain('job search');
  });
});

describe('invalid backups are rejected (and can never clobber live data)', () => {
  const rejects = (text: string) => {
    const result = validateBackupText(text);
    expect(result.ok).toBe(false);
  };

  test('not JSON', () => rejects('hello'));
  test('empty object', () => rejects('{}'));
  test('wrong kind', () => {
    const bad = buildBackup(sample()) as unknown as Record<string, unknown>;
    bad.kind = 'something-else';
    rejects(JSON.stringify(bad));
  });
  test('wrong version', () => {
    const bad = buildBackup(sample()) as unknown as Record<string, unknown>;
    bad.version = 99;
    rejects(JSON.stringify(bad));
  });
  test('story missing fields', () => {
    const bad = buildBackup(sample());
    delete (bad.data.stories[0] as Partial<(typeof bad.data.stories)[0]>).result;
    rejects(JSON.stringify(bad));
  });
  test('pack with unknown interview type', () => {
    const bad = buildBackup(sample());
    (bad.data.packs[0] as { type: string }).type = 'surprise-me';
    rejects(JSON.stringify(bad));
  });
  test('pack question with non-string notes', () => {
    const bad = buildBackup(sample());
    (bad.data.packs[0].questions[0] as { notes: unknown }).notes = 42;
    rejects(JSON.stringify(bad));
  });
  test('missing pitch', () => {
    const bad = buildBackup(sample()) as unknown as { data: Record<string, unknown> };
    delete bad.data.pitch;
    rejects(JSON.stringify(bad));
  });
});
