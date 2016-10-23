import {expect} from 'chai';
import {Changelog} from './changelog';
import {GitRepo} from './util/git';
import {IBlueprint} from './blueprint';
import {AngularBlueprint} from 'changez-angular';

describe('Changelog', () => {
  let parser: IBlueprint;
  let repo: GitRepo;
  let changelog: Changelog;

  beforeEach(() => {
    parser = new AngularBlueprint();
    repo = new GitRepo();
    changelog = new Changelog(parser, repo, { info() {} });
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

  describe('render()', () => {

  });
});