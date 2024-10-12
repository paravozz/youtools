import { describe, it, expect } from 'vitest';
import { capitalize } from '../../src/tools/capitalize';


describe('capitalize', () => {
  it('should capitalize a regular lowercase word', () => {
    const result = capitalize('hello');
    expect(result).toBe('Hello');
  });

  it('should return the same word if already capitalized', () => {
    const result = capitalize('Hello');
    expect(result).toBe('Hello');
  });

  it('should return an empty string if input is an empty string', () => {
    const result = capitalize('');
    expect(result).toBe('');
  });

  it('should capitalize a single character string', () => {
    const result = capitalize('a');
    expect(result).toBe('A');
  });

  it('should handle strings starting with non-alphabetic characters', () => {
    const result = capitalize('123abc');
    expect(result).toBe('123abc');
  });

  it('should handle strings with spaces at the beginning', () => {
    const result = capitalize(' hello');
    expect(result).toBe(' hello');
  });

  it('should not modify other parts of the string', () => {
    const result = capitalize('hELLO');
    expect(result).toBe('HELLO');
  });

  it('should return the original string if the first character is already uppercase', () => {
    const result = capitalize('Hello');
    expect(result).toBe('Hello');
  });

});
