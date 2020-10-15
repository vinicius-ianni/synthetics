import { Browser, Page, BrowserContext, CDPSession } from 'playwright';
import { Step, StepCallback } from './step';

export type JourneyOptions = {
  name: string;
  id?: string;
};

export type JourneyCallback = (options: {
  page: Page;
  context: BrowserContext;
  browser: Browser;
  client: CDPSession;
  params: Record<string, any>;
}) => Promise<void>;

export class Journey {
  name: string;
  id?: string;
  callback: JourneyCallback;
  steps: Step[] = [];

  constructor(options: JourneyOptions, callback: JourneyCallback) {
    this.name = options.name;
    this.id = options.id;
    this.callback = callback;
  }

  addStep(name: string, callback: StepCallback) {
    const step = new Step(name, this.steps.length + 1, callback);
    this.steps.push(step);
    return step;
  }
}
