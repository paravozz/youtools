import { describe, it, expect } from 'vitest';

import { leftPad } from "../../src/tools/left-pad";


describe('left-pad', () => {
  it('should pad the string with spaces by default', () => {
    const result = leftPad("abc", 6);
    expect(result).toBe('   abc');
  });

  it('should pad the string with specified characters', () => {
    const result = leftPad("abc", 6, '0');
    expect(result).toBe('000abc');
  });

  it('should return the original string if the target length is less than or equal to the string length', () => {
    const result = leftPad("abc", 2, '0')
    expect(result).toBe('abc');
  });

  it('should pad with the entire padding string if it fits exactly', () => {
    const result = leftPad("abc", 5, '12')
    expect(result).toBe('12abc');
  });

  it('should truncate the padding string if necessary', () => {
    const result = leftPad("abc", 8, '12345678')
    expect(result).toBe('12345abc');
  });

  it('should handle empty padding string by returning the original string', () => {
    const result = leftPad("abc", 5, '')
    expect(result).toBe('abc');
  });

  it('should handle an empty string being padded', () => {
    const result = leftPad("", 4, '0')
    expect(result).toBe('0000');
  });

  it('should return the original string if the padding string is undefined', () => {
    const result = leftPad("abc", 6, undefined)
    expect(result).toBe('   abc');
  });
});
