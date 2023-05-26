import type { AggregatedIdentifier } from '../ids';
import * as symbols from '../symbols';
import type { HookType } from '../types';

import { BaseMetadata } from './BaseMetadata';
import type { DescribeBlockMetadata } from './DescribeBlockMetadata';
import type { HookInvocationMetadata } from './HookInvocationMetadata';
import type { MetadataContext } from './MetadataContext';
import type { TestInvocationMetadata } from './TestInvocationMetadata';

export class HookDefinitionMetadata extends BaseMetadata {
  invocations: HookInvocationMetadata[] = [];

  constructor(
    context: MetadataContext,
    public readonly owner: DescribeBlockMetadata,
    id: AggregatedIdentifier,
    public readonly hookType: HookType,
  ) {
    super(context, id);

    if (
      hookType !== 'beforeEach' &&
      hookType !== 'afterEach' &&
      hookType !== 'beforeAll' &&
      hookType !== 'afterAll'
    ) {
      throw new TypeError(`Unknown hook type: ${hookType}`);
    }
  }

  [symbols.start](): HookInvocationMetadata {
    const run = this.owner.run;
    const parent = run.current.invocationParent;
    if (!parent) {
      throw new Error('Cannot start hook invocation outside of test or describe block');
    }

    const id = this[symbols.id].nest(`${this.invocations.length}`);
    const invocation = this[symbols.context].factory.createHookInvocationMetadata(this, parent, id);

    this.invocations.push(invocation);
    run[symbols.currentMetadata] = invocation;

    const checker = this[symbols.context].checker;
    switch (this.hookType) {
      case 'beforeEach': {
        checker
          .asTestInvocationMetadata(parent)!
          .before.push(invocation as HookInvocationMetadata<TestInvocationMetadata>);
        break;
      }
      case 'afterEach': {
        checker
          .asTestInvocationMetadata(parent)!
          .after.push(invocation as HookInvocationMetadata<TestInvocationMetadata>);
        break;
      }
      case 'beforeAll':
      case 'afterAll': {
        checker
          .asDescribeBlockMetadata(parent)!
          .invocations.push(invocation as HookInvocationMetadata<DescribeBlockMetadata>);
        break;
      }
    }

    return invocation;
  }

  [symbols.finish](): void {
    const run = this.owner.run;
    const lastInvocation = this.invocations[this.invocations.length - 1];
    if (!lastInvocation) {
      throw new Error('Cannot finish hook invocation without starting it');
    }

    run[symbols.currentMetadata] = lastInvocation.parent;
  }
}
