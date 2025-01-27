import { CommandCore, exec } from '@midwayjs/command-core';
const sleep = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};
import { DevPlugin } from '../src';
export const wait = (time?) => {
  return new Promise(resolve => {
    setTimeout(resolve, time || 20000);
  });
};
export const run = async (cwd: string, options: any = {}) => {
  if (!options?.ignoreMock) {
    await exec({
      baseDir: cwd,
      cmd: 'npm install @midwayjs/mock',
    });
  }
  const core = new CommandCore({
    commands: ['dev'],
    options,
    log: {
      log: console.log,
    },
    cwd,
  });
  core.addPlugin(DevPlugin);
  await core.ready();
  core.invoke(['dev'], false, {
    ts: true,
    ...options,
  });
  let i = 0;
  let port;
  while (!port && i < 10) {
    i++;
    port = core.store.get('global:dev:port');
    await sleep(1000);
  }
  return {
    close: core.store.get('global:dev:closeApp'),
    port,
    getData: core.store.get('global:dev:getData'),
  };
};
