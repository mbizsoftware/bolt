// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { showVersion, updateVersion } from '../utils/versionUtil';
import type { VersionOptions } from '../utils/versionUtil';

export function toVersionOptions(
  args: options.Args,
  flags: options.Flags
): VersionOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    version: args[0]
  };
}

export async function version(opts: VersionOptions) {
  if (!opts.version) {
    return await showVersion(opts);
  }

  await updateVersion(opts);
  // throw new BoltError('Unimplemented command "version"');
}
