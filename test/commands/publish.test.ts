import { expect } from '@oclif/test';
import * as tmp from 'tmp';
import * as execa from 'execa';
import * as del from 'del';
import { promises as fs } from 'fs';
import { ReleasePlan } from '@changesets/types';
import { Config } from '../../src/types';
import { resolve, join } from 'path';

describe('publish', () => {
  let disposeFunctions: Array<() => void> = [];
  afterEach(async () => {
    await Promise.all(disposeFunctions.map((f) => f()));
    disposeFunctions = [];
  });

  it('should run custom script', async () => {
    const projectDir = tmp.dirSync();
    disposeFunctions.push(async () => {
      await del(projectDir.name, { force: true });
    });

    await fs.mkdir(`${projectDir.name}/.changeset`);
    await fs.writeFile(
      join(projectDir.name, 'package.json'),
      JSON.stringify({
        name: '@my-org/my-pkg',
        version: '1.2.2',
      })
    );
    await fs.writeFile(
      join(projectDir.name, '.changeset/.release-plan.json'),
      JSON.stringify({
        changesets: [],
        releases: [
          {
            changesets: [],
            name: '@my-org/my-pkg',
            newVersion: '1.2.3',
            oldVersion: '1.2.2',
            type: 'patch',
          },
        ],
        preState: undefined,
      } as ReleasePlan)
    );
    await fs.writeFile(
      join(projectDir.name, '.changeset/changeset-run.config.json'),
      JSON.stringify({
        packageOptions: {
          '@my-org/my-pkg': {
            steps: [
              {
                command: 'echo',
                args: ['Published version:', [{ $: 'newVersion' }]],
              },
            ],
          },
        },
      } as Config)
    );
    await execa('git', ['init'], { cwd: projectDir.name });
    await execa('git', ['add', '-A', '.'], { cwd: projectDir.name });
    await execa('git', ['commit', '-m', 'Initial commit'], {
      cwd: projectDir.name,
    });
    const result = await execa(
      resolve(__dirname, '../../bin/run'),
      ['publish'],
      { cwd: projectDir.name }
    );
    expect(result.stdout)
      .to.include('Published version:')
      .and.to.include('1.2.3');
  });
});
