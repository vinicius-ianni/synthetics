#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createInterface as createReadlineInterface } from 'readline';
import { step, journey } from './core';
import { run } from './';
import { parseArgs } from './parse_args';

const readStdin = async () => {
  let source = '';
  const rl = createReadlineInterface({ input: process.stdin });
  rl.on('line', line => {
    source += line + '\n';
  });

  return new Promise<string>(resolve => {
    rl.on('close', () => {
      resolve(source);
    });
  });
};

const loadInlineScript = source => {
  const scriptFn = new Function('step', 'page', 'browser', 'params', source);
  journey('inline', async ({ page, browser, params }) => {
    scriptFn.apply(null, [step, page, browser, params]);
  });
};

const program = parseArgs();
const suiteParams = JSON.parse(program.suiteParams);
const filePath = program.args[0];
const singleMode = program.stdin || filePath;
/**
 * use JSON reporter if json flag is enabled
 */
const reporter = program.json ? 'json' : 'default';
/**
 * Set debug based on flag
 */
process.env.DEBUG = program.debug || '';

(async () => {
  if (singleMode) {
    const source = program.stdin
      ? await readStdin()
      : readFileSync(filePath, 'utf8');
    loadInlineScript(source);
  }

  await run({
    params: suiteParams,
    environment: program.environment,
    reporter,
    headless: program.headless,
    screenshots: program.screenshots,
    dryRun: program.dryRun,
    journeyName: program.journeyName,
    network: program.network,
    pauseOnError: program.pauseOnError,
    outfd: program.outfd,
    metrics: program.metrics,
  });
})();
