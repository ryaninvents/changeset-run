import { Arg, ArgPart } from '../types';

export function processArg(arg: Arg, lookup: Record<string, string>): string {
  if (typeof arg === 'string') return arg;
  return arg
    .map((argPart: ArgPart) => {
      if (typeof argPart === 'string') return argPart;
      if (!(argPart.$ in lookup)) {
        throw new Error(
          `No variable "${
            argPart.$
          }" in lookup\n\nFound these keys: ${JSON.stringify(
            Object.keys(lookup),
            null,
            2
          )}`
        );
      }
      return lookup[argPart.$];
    })
    .join('');
}
export function processArgs(
  args: Array<Arg>,
  lookup: Record<string, string>
): Array<string> {
  return args.map((arg) => processArg(arg, lookup));
}
