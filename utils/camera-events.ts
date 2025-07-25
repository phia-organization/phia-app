type Callback = () => void;

const listeners = new Set<Callback>();

export function emitCameraTakePhoto() {
  listeners.forEach((cb) => cb());
}

export function subscribeToCameraTakePhoto(cb: Callback) {
  listeners.add(cb);
  return () => listeners.delete(cb); // unsubscribe
}
