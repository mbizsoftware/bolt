// @flow
import Project from '../Project';
import * as logger from './logger';
import semver from 'semver';
import Package from '../Package';
import { DEPENDENCY_TYPES } from '../constants';
import symlinkPackageDependencies from './symlinkPackageDependencies';

export type VersionOptions = {
  version?: string,
  cwd?: string
};

export async function showVersion(opts: VersionOptions = Object.freeze({})) {
  let cwd = opts.cwd || process.cwd();

  let project = await Project.init(cwd);
  logger.info(project.pkg.getVersion());
}

export async function updateVersion(opts: VersionOptions = Object.freeze({})) {
  let cwd = opts.cwd || process.cwd();

  let project = await Project.init(cwd);
  let newVersion = semver.inc(project.pkg.getVersion(), opts.version);

  await project.pkg.updateVersion(newVersion);

  let packages: Package[] = await project.getPackages();
  let packageNames = packages.map((a: Package) => a.config.getName());

  for (let pkg of packages) {
    await pkg.updateInternalDependencies(packageNames, newVersion);
  }

  for (let pkg of packages) {
    await symlinkPackageDependencies(
      project,
      pkg,
      Array.from(pkg.getAllDependencies().keys()),
      (await project.getDependentsGraph(await project.getPackages())).graph
    );
  }
}
