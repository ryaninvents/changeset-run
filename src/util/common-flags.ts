import { flags } from '@oclif/command';

export const DEFAULT_PLANFILE = './.changeset/.release-plan.json';
export const DEFAULT_CONFIG = './.changeset/changeset-run.config.json';

export const planfile = flags.string({
  char: 'p',
  description: 'release plan file to write to; must be in .gitignore',
  default: DEFAULT_PLANFILE,
});
