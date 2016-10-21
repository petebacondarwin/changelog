import {expect} from 'chai';
import {Changelog} from './changelog';
import {GitRepo} from './util/git';
import {ICommitParser} from './commit-parser';
import {AngularCommitParser} from './angularjs/angular-commit-parser';

describe('Changelog', () => {
  let parser: ICommitParser;
  let repo: GitRepo;
  let changelog: Changelog;

  beforeEach(() => {
    parser = new AngularCommitParser();
    repo = new GitRepo();
    changelog = new Changelog(parser, repo);
  });

  describe('getChanges()', () => {
    it('should filter commits that are in both branches', () => {
      const commits = changelog.getChanges('test-1', 'test-2')
          .map(commit => commit.toString());

      expect(commits).to.eql([
        // 'revert:feat(B): title B',  -- revert of commit below
        'feat(E): title E',
        // 'refactor(B): refactor B',  -- not whitelisted
        // 'perf(D): title D',         -- already in test-2
        // 'chore(C): title C',        -- already in test-2
        // 'feat(B): title B',         -- reverted in commit above
        'fix(A): title A',
        // 'docs(README): add it'      -- not whitelisted
      ]);
    });
  });

  describe('getCommits()', () => {
    it('should parse and filter the raw commits', () => {
      const commits = changelog.getCommits('diverge-point', 'test-1')
        .map(commit => commit.toString());
      expect(commits).to.eql([
        'revert:feat(B): title B',
        'feat(E): title E',
        'refactor(B): refactor B',
        'perf(D): title D',
        'chore(C): title C',
        'feat(B): title B'
      ]);
    });
  });
});