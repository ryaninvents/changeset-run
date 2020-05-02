# @ryaninvents/changeset-run

Use custom publish scripts for packages in Atlassian Changesets, perfect for non-npm artifacts

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@ryaninvents/changeset-run.svg)](https://npmjs.org/package/@ryaninvents/changeset-run)
[![CircleCI](https://circleci.com/gh/ryaninvents/changeset-run/tree/master.svg?style=shield)](https://circleci.com/gh/ryaninvents/changeset-run/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/@ryaninvents/changeset-run.svg)](https://npmjs.org/package/@ryaninvents/changeset-run)
[![License](https://img.shields.io/npm/l/@ryaninvents/changeset-run.svg)](https://github.com/ryaninvents/changeset-run/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @ryaninvents/changeset-run
$ changeset-run COMMAND
running command...
$ changeset-run (-v|--version|version)
@ryaninvents/changeset-run/0.0.0 linux-x64 node-v12.16.1
$ changeset-run --help [COMMAND]
USAGE
  $ changeset-run COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`changeset-run hello [FILE]`](#changeset-run-hello-file)
- [`changeset-run help [COMMAND]`](#changeset-run-help-command)
- [`changeset-run preversion [FILE]`](#changeset-run-preversion)

## `changeset-run hello [FILE]`

describe the command here

```
USAGE
  $ changeset-run hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ changeset-run hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/ryaninvents/changeset-run/blob/v0.0.0/src/commands/hello.ts)_

## `changeset-run help [COMMAND]`

display help for changeset-run

```
USAGE
  $ changeset-run help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `changeset-run preversion`

Cache planned publish steps before running `changeset version`

```
USAGE
  $ changeset-run preversion

OPTIONS
  -p, --planfile=./.changeset/.release-plan.json  temporary file to write to; must be in .gitignore
  -h, --help                                      show CLI help
```

_See code: [src/commands/preversion.ts](https://github.com/ryaninvents/changeset-run/blob/master/src/commands/preversion.ts)_

  -h, --help       show CLI help
```

_See code: [src/commands/preversion.ts](https://github.com/ryaninvents/changeset-run/blob/master/src/commands/preversion.ts)_

<!-- commandsstop -->
