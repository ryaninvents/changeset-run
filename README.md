# @ryaninvents/changeset-run

Use custom publish scripts for packages in Atlassian Changesets, perfect for non-npm artifacts

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@ryaninvents/changeset-run.svg)](https://npmjs.org/package/@ryaninvents/changeset-run)
[![CircleCI](https://circleci.com/gh/ryaninvents/changeset-run/tree/master.svg?style=shield)](https://circleci.com/gh/ryaninvents/changeset-run/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/@ryaninvents/changeset-run.svg)](https://npmjs.org/package/@ryaninvents/changeset-run)
[![License](https://img.shields.io/npm/l/@ryaninvents/changeset-run.svg)](https://github.com/ryaninvents/changeset-run/blob/master/package.json)

<!-- toc -->

- [@ryaninvents/changeset-run](#ryaninventschangeset-run)
- [Usage](#usage)
- [Config](#config)
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

# Config

Here's the config file format. Comments here are only for illustration; if you add comments to your config file it will break.

```jsonc
{
  "packageOptions": {
    // Keyed on the name of the package. If a package is not listed, ordinary `npm publish` will apply.
    "@my-scope/docker-package": {
      "steps": [
        {
          // The command to run
          "command": "docker",
          // Array of arguments to the command.
          "args": [
            // Ordinary string argument
            "build",
            "-t",
            // Array argument. Values are concatenated together; objects with a "$" key represent a
            // variable to look up in the release plan. Possible values are `newVersion`, `oldVersion`,
            // `releaseType`, and `packageName`
            ["my-scope/image-name:", { "$": "newVersion" }],
            "."
          ]
        },
        {
          "command": "docker",
          "args": ["push"]
        }
      ]
    }
  }
}
```

# Commands

<!-- commands -->

- [`changeset-run hello [FILE]`](#changeset-run-hello-file)
- [`changeset-run help [COMMAND]`](#changeset-run-help-command)
- [`changeset-run preversion`](#changeset-run-preversion)
- [`changeset-run publish`](#changeset-run-publish)

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
  -h, --help               show CLI help

  -p, --planfile=planfile  [default: ./.changeset/.release-plan.json] release plan file to write to; must be in
                           .gitignore
```

_See code: [src/commands/preversion.ts](https://github.com/ryaninvents/changeset-run/blob/master/src/commands/preversion.ts)_

## `changeset-run publish`

Run custom publish command for one or more packages in this project.

```
USAGE
  $ changeset-run publish

OPTIONS
  -c, --config=config      [default: ./.changeset/changeset-run.config.json] Path to alternate changeset-run config file
  -h, --help               show CLI help

  -p, --planfile=planfile  [default: ./.changeset/.release-plan.json] release plan file to write to; must be in
                           .gitignore

  --exclude=exclude        [default: ] Individual package name to prevent publish. May be specified multiple times;
                           processed after --include

  --include=include        [default: ] Individual package name to publish. May be specified multiple times; processed
                           before --exclude
```

_See code: [src/commands/publish.ts](https://github.com/ryaninvents/changeset-run/blob/master/src/commands/publish.ts)_

<!-- commandsstop -->
