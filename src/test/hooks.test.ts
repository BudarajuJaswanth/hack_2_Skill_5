import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes with default value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-state'));
    expect(result.current[0]).toBe('initial-state');
  });

  it('persists and updates string value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-state'));

    act(() => {
      result.current[1]('updated-state');
    });

    expect(result.current[0]).toBe('updated-state');
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('updated-state'));
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('count-key', 10));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
    expect(window.localStorage.getItem('count-key')).toBe(JSON.stringify(15));
  });

  it('reads pre-existing stored json data correctly', () => {
    window.localStorage.setItem('user-profile', JSON.stringify({ name: 'Alex', role: 'Planner' }));

    const { result } = renderHook(() =>
      useLocalStorage('user-profile', { name: '', role: '' })
    );

    expect(result.current[0]).toEqual({ name: 'Alex', role: 'Planner' });
  });
});

