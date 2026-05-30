import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default value if key not present', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('defaultValue');
  });

  it('sets and gets value', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    
    act(() => {
      result.current[1]('newValue');
    });
    
    expect(result.current[0]).toBe('newValue');
    expect(localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('removes value', () => {
    localStorage.setItem('testKey', JSON.stringify('storedValue'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    
    expect(result.current[0]).toBe('storedValue');
    
    act(() => {
      result.current[2]();
    });
    
    expect(result.current[0]).toBe('defaultValue');
    expect(localStorage.getItem('testKey')).toBeNull();
  });
});
