import type {
  BaseMetadata,
  DescribeBlockMetadata,
  HookDefinitionMetadata,
  HookInvocationMetadata,
  RunMetadata,
  TestEntryMetadata,
  TestFnInvocationMetadata,
  TestInvocationMetadata,
} from '../containers';

export interface MetadataSelector {
  readonly value: () => BaseMetadata | undefined;
  readonly run: RunMetadata | undefined;
  readonly describeBlock: DescribeBlockMetadata | undefined;
  readonly testEntry: TestEntryMetadata | undefined;
  readonly hookDefinition: HookDefinitionMetadata | undefined;
  readonly definition:
    | DescribeBlockMetadata
    | HookDefinitionMetadata
    | TestEntryMetadata
    | undefined;
  readonly testFnInvocation: TestFnInvocationMetadata | undefined;
  readonly hookInvocation: HookInvocationMetadata | undefined;
  readonly testInvocation: TestInvocationMetadata | undefined;
  readonly invocationParent: TestInvocationMetadata | DescribeBlockMetadata | undefined;
  readonly invocation:
    | RunMetadata
    | DescribeBlockMetadata
    | HookInvocationMetadata
    | TestInvocationMetadata
    | TestFnInvocationMetadata
    | undefined;
}

export type MetadataSelectorFactory = (value: () => BaseMetadata) => MetadataSelector;
