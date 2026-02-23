type UnauthorizedCallback = () => void;

let handler: UnauthorizedCallback | null = null;

export function setUnauthorizedHandler(callback: UnauthorizedCallback | null): void {
  handler = callback;
}

export function runUnauthorizedHandler(): void {
  handler?.();
}
