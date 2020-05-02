export type ArgPart =
  | string
  | {
      /** Represents a variable to interpolate */
      $: string;
    };
export type Arg = string | Array<ArgPart>;

export type PublishStep = {
  command: Arg;
  args: Array<Arg>;
};

export type PackageOptions = {
  steps: Array<PublishStep>;
};

export type Config = {
  packageOptions: Record<string, PackageOptions>;
};
