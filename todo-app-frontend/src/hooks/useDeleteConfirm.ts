import { useState, useCallback } from 'react';

export function useDeleteConfirm<T = string>() {
  const [target, setTarget] = useState<T | null>(null);

  const requestDelete = useCallback((id: T) => {
    setTarget(id);
  }, []);

  const close = useCallback(() => {
    setTarget(null);
  }, []);

  return {
    target,
    isOpen: target !== null,
    requestDelete,
    close
  };
}
