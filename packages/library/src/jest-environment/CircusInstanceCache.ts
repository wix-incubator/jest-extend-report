export class CircusInstanceCache {
  private describeInstances = new InstanceCache();
  private hookInstances = new InstanceCache();
  private testInstances = new InstanceCache();

  getDescribeId(block: object) {
    return `describe_${this.describeInstances.getInstanceId(block)}`;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  getHookId(fn: Function): string {
    return `hook_${this.hookInstances.getInstanceId(fn)}`;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  getTestId(fn: Function): string {
    return `test_${this.testInstances.getInstanceId(fn)}`;
  }
}

class InstanceCache {
  private readonly cache = new WeakMap<any, string>();
  private counter = 0;

  getInstanceId = (obj: any): string => {
    if (!this.cache.has(obj)) {
      this.cache.set(obj, `${this.counter++}`);
    }

    return this.cache.get(obj)!;
  };
}
