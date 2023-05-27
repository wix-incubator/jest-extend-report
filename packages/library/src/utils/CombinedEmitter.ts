import type { Emitter, ReadonlyEmitter } from '../types';
import { SerialEmitter } from './SerialEmitter';

export class CombinedEmitter<Event extends { type: string }> implements ReadonlyEmitter<Event> {
  private readonly emitters = new WeakSet<Emitter<Event>>();
  private readonly rootEmitter = new SerialEmitter<Event>('combined');

  add(emitter: Emitter<Event>): this {
    if (!this.emitters.has(emitter)) {
      this.emitters.add(emitter);
      emitter.on('*', (event: Event) => /* re-emit */ this.rootEmitter.emit(event));
    }

    return this;
  }

  on(type: Event['type'] | '*', listener: (event: Event) => void): this {
    this.rootEmitter.on(type, listener);
    return this;
  }

  once(type: Event['type'] | '*', listener: (event: Event) => void): this {
    this.rootEmitter.once(type, listener);
    return this;
  }

  off(type: Event['type'] | '*', listener: (event: Event) => void): this {
    this.rootEmitter.off(type, listener);
    return this;
  }
}
