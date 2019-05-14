import { Wuffy } from '../wuffy';

export interface Module {
  initialize(wuffy: Wuffy): Promise<void> | void;
  onReady(wuffy: Wuffy): Promise<void> | void;
}

export interface ModuleConstructor<T extends Module> {
  new (): T;
}