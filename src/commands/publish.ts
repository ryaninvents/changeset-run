import { Command, flags } from '@oclif/command';
import { getPackages } from '@manypkg/get-packages';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { planfile as planfileFlag, DEFAULT_CONFIG } from '../util/common-flags';
import { ReleasePlan, ComprehensiveRelease } from '@changesets/types';
import { Config, PackageOptions, PublishStep } from '../types';
import { processArg, processArgs } from '../util/process-args';
import * as chalk from 'chalk';
import * as execa from 'execa';

function processIncludesAndExcludes({
  includes,
  excludes,
  packages,
}: {
  includes: Array<string>;
  excludes: Array<string>;
  packages: Array<string>;
}): Array<string> {
  let finalPackages = packages;
  if (includes.length > 0)
    finalPackages = finalPackages.filter((pkg) => includes.includes(pkg));
  finalPackages = finalPackages.filter((pkg) => !excludes.includes(pkg));
  return finalPackages;
}

async function getReleasePlan({
  planfile,
}: {
  planfile: string;
}): Promise<ReleasePlan> {
  const planfileContents = await fs.readFile(resolve(process.cwd(), planfile));
  return JSON.parse(planfileContents.toString());
}

async function getConfig({ config }: { config: string }): Promise<Config> {
  const configContents = await fs.readFile(resolve(process.cwd(), config));
  return JSON.parse(configContents.toString());
}

async function addGitTag({
  packageName,
  newVersion,
  releasePlan,
}: {
  packageName: string;
  newVersion: string;
  releasePlan: ReleasePlan;
}) {
  const release = releasePlan.releases.find(
    (release) => release.name === packageName
  );
  if (!release) {
    return;
  }
  const releaseTagNotes = [
    `## Release ${packageName}@${newVersion}\n\n`,
    ...release.changesets.map((changesetId) => {
      const changeset = releasePlan.changesets.find(
        (changeset) => changeset.id === changesetId
      );
      if (!changeset) return '';
      return `- ${changeset.summary}\n`;
    }),
  ].join('');

  await execa(
    'git',
    ['tag', '-a', `${packageName}@${newVersion}`, '-m', releaseTagNotes],
    { stdio: 'inherit' }
  );
}

function getExecutableStep({
  step,
  variables,
}: {
  step: PublishStep;
  variables: Record<string, string>;
}): [string, Array<string>] {
  // Interpolate the release parameters into the build commands from the config.
  const command = processArg(step.command, variables);
  const args = processArgs(step.args, variables);
  return [command, args];
}

export default class Publish extends Command {
  static description =
    'Run custom publish command for one or more packages in this project.';

  static flags = {
    help: flags.help({ char: 'h' }),
    planfile: planfileFlag,
    include: flags.string({
      multiple: true,
      description:
        'Individual package name to publish. May be specified multiple times; processed before --exclude',
      default: [],
    }),
    exclude: flags.string({
      multiple: true,
      description:
        'Individual package name to prevent publish. May be specified multiple times; processed after --include',
      default: [],
    }),
    config: flags.string({
      char: 'c',
      description: 'Path to alternate changeset-run config file',
      default: DEFAULT_CONFIG,
    }),
  };

  static args = [];

  async run() {
    const { flags } = this.parse(Publish);
    const config = await getConfig({ config: flags.config });
    const releasePlan = await getReleasePlan({ planfile: flags.planfile });
    const { packages: allPackages } = await getPackages(process.cwd());
    const packagesToRelease = processIncludesAndExcludes({
      includes: flags.include,
      excludes: flags.exclude,
      packages: releasePlan.releases.map((r) => r.name),
    });
    if (packagesToRelease.length === 0) {
      console.log(
        chalk.yellow('No packages to publish with given "includes", "excludes"')
      );
      return;
    }
    const releaseFns = packagesToRelease.map((packageName) => {
      const packageOptions: PackageOptions = config.packageOptions[
        packageName
      ] || {
        steps: [{ command: 'npm', args: ['publish'] }],
      };
      const plannedRelease: ComprehensiveRelease = releasePlan.releases.find(
        (plannedRelease) => plannedRelease.name === packageName
      ) as /* At this point we know the release exists, so the `find` call will succeed. Coerce with `any` to make TS happy. */ any;

      const pkg = allPackages.find((p) => p.packageJson.name === packageName);

      if (!pkg) {
        throw new Error(
          `Package ${packageName} specified, but not found in repo.`
        );
      }

      /** Lookup for JSON pseudo-template variables */
      const variables = {
        packageName,
        releaseType: plannedRelease.type,
        oldVersion: plannedRelease.oldVersion,
        newVersion: plannedRelease.newVersion,
      };

      return async () => {
        console.log(chalk.bold(`Starting to publish ${packageName}`));
        for (let i = 0; i < packageOptions.steps.length; i++) {
          const step = packageOptions.steps[i];
          const [command, args] = getExecutableStep({ step, variables });

          // `no-await-in-loop` disabled because we really do want these executed sequentially.
          // eslint-disable-next-line no-await-in-loop
          await execa(command, args, { cwd: pkg.dir, stdio: 'inherit' });
        }
        await addGitTag({
          packageName,
          newVersion: plannedRelease.newVersion,
          releasePlan,
        });
        console.log(chalk.bold(`Finished publishing ${packageName}`));
      };
    });

    await releaseFns.reduce(
      (state, next) => state.then(next),
      Promise.resolve()
    );
  }
}
