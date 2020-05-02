import { Command, flags } from '@oclif/command';
import * as execa from 'execa';
import * as hasYarn from 'has-yarn';
import * as chalk from 'chalk';

const DEFAULT_PLANFILE = './.changeset/.release-plan.json';

export default class Preversion extends Command {
  static description =
    'Cache planned publish steps before running `changeset version`';

  static flags = {
    help: flags.help({ char: 'h' }),
    planfile: flags.string({
      char: 'p',
      description: 'release plan file to write to; must be in .gitignore',
      default: DEFAULT_PLANFILE,
    }),
  };

  async run() {
    const { flags } = this.parse(Preversion);

    const filename = flags.planfile || DEFAULT_PLANFILE;

    let command = 'npx';
    let args = ['--quiet'];
    if (hasYarn(process.cwd())) {
      command = 'yarn';
      args = ['--silent']; // You must be much sterner with Yarn than npx.
    }

    try {
      await execa(
        command,
        [...args, 'changeset', 'status', '--verbose', `--output=${filename}`],
        {
          stdio: 'inherit',
        }
      );
      console.log(
        chalk.green(`Output changeset data to ${chalk.blue(filename)}.`)
      );
    } catch (error) {
      {
        const execaError: execa.ExecaError = error;
        console.error(
          chalk.red(
            `${chalk.bold(execaError.shortMessage)}\n\n${execaError.stderr}`
          )
        );
      }
    }
  }
}
