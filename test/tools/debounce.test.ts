import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { debounce } from "../../src/tools/debounce";


describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('should call the function after the specified delay', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 840);

    debouncedFunc();

    vi.advanceTimersByTime(840);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should not call the function immediately when leading is false', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 420);

    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(420);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should call the function immediately when leading is true', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 420, { leading: true });

    debouncedFunc();

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(420);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should call the function only once when called multiple times in a row', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 840);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    vi.advanceTimersByTime(840);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should call the function with the latest arguments', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 840);

    debouncedFunc('first');
    debouncedFunc('second');
    debouncedFunc('third');

    vi.advanceTimersByTime(840);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('third');
  });

  it('should maintain the correct "this" context', () => {
    const context = {
      value: 69,
      getValue(this: { value: number }) {
        return this.value;
      },
    };

    const func = vi.spyOn(context, 'getValue');
    const debouncedFunc = debounce(context.getValue, 840);

    debouncedFunc.call(context);

    vi.advanceTimersByTime(840);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func.mock.instances[0]).toBe(context);
    expect(func.mock.results[0].value).toBe(69);
  });

  it('should call the function once when called once with leading and trailing true', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 420, { leading: true, trailing: true });

    debouncedFunc();

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(420);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should call the function on both leading and trailing edges when invoked multiple times', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 420, { leading: true, trailing: true });

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(420);

    expect(func).toHaveBeenCalledTimes(2);
  });

  it('should cancel previous timers on subsequent calls within wait period', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 840);

    debouncedFunc();
    vi.advanceTimersByTime(420);
    debouncedFunc();
    vi.advanceTimersByTime(420);
    debouncedFunc();

    vi.advanceTimersByTime(840);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should not call the function after delay when trailing is false', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 840, { trailing: false });

    debouncedFunc();

    vi.advanceTimersByTime(840);

    expect(func).toHaveBeenCalledTimes(0);
  });

  it('should pass the correct arguments to the original function', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 420);

    debouncedFunc('arg1', 42);
    debouncedFunc('arg2', 69);

    vi.advanceTimersByTime(420);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('arg2', 69);
  });

  it('should return the value from the original function when leading is true', () => {
    const func = vi.fn().mockReturnValue('result');
    const debouncedFunc = debounce(func, 420, { leading: true, trailing: false });

    const result = debouncedFunc('test');

    expect(func).toHaveBeenCalledTimes(1);
    expect(result).toBe('result');
  });

  it('should return undefined when leading is false and function has not been called yet', () => {
    const func = vi.fn().mockReturnValue('result');
    const debouncedFunc = debounce(func, 420);

    const result = debouncedFunc('test');

    expect(func).not.toHaveBeenCalled();
    expect(result).toBeUndefined();

    vi.advanceTimersByTime(420);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('test');
    expect(func).toHaveReturnedWith('result');
  });

  it('should handle functions that return promises', async () => {
    const asyncFunc = vi.fn().mockResolvedValue('async result');
    const debouncedFunc = debounce(asyncFunc, 420);

    debouncedFunc('test');

    vi.advanceTimersByTime(420);

    expect(asyncFunc).toHaveBeenCalledTimes(1);
    expect(asyncFunc.mock.results[0].value).toBeInstanceOf(Promise);
    await expect(asyncFunc.mock.results[0].value).resolves.toBe('async result');
  });

  it('should handle functions with multiple parameters', () => {
    const func = vi.fn((a: number, b: number, c: number) => a + b + c);
    const debouncedFunc = debounce(func, 420);

    debouncedFunc(1, 2, 3);
    debouncedFunc(4, 5, 6);

    vi.advanceTimersByTime(420);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(4, 5, 6);
    expect(func).toHaveReturnedWith(4 + 5 + 6);
  });

  it('should handle functions that accept and return values', () => {
    const func = vi.fn((x: number) => x * 2);
    const debouncedFunc = debounce(func, 420);

    const result = debouncedFunc(34.5);

    vi.advanceTimersByTime(420);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(34.5);
    expect(func).toHaveReturnedWith(69);
    expect(result).toBeUndefined();
  });

  it('should return the result after the function is called when trailing is true', () => {
    const func = vi.fn((x: number) => x * 2);
    const debouncedFunc = debounce(func, 420);

    debouncedFunc(34.5);

    vi.advanceTimersByTime(420);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(34.5);
    expect(func).toHaveReturnedWith(69);
  });
});
