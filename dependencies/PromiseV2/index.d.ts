export class Promise<T> {
  static PENDING: any;
  static FULFILLED: any;
  static REJECTED: any;

  constructor(callback: (resolve: (result: T) => void, reject: (result: T) => void) => void)
  then<P>(onFulfilled: (value: T) => P, onRejected: (value: T) => P): Promise<P>;
  catch<P>(onRejected: (value: T) => P): Promise<P>;
  static all<P>(promises: Promise<P>[]): Promise<P[]>;
  static race<P>(promises: Promise<P>[]): Promise<P>;
  static resolve<P>(value: P | Promise<P>): Promise<P>;
  static reject<P>(value: P): Promise<P>;
}

export default Promise;
