function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error != null && typeof error === 'object' && 'response' in error) {
    const res = (error as { response?: { data?: unknown } }).response;
    const data = res?.data;
    if (data != null && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      if (typeof d.message === 'string' && d.message) return d.message;
      if (typeof d.error === 'string' && d.error) return d.error;
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export { getErrorMessage };
