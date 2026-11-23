import net from 'net';

/**
 * @returns {'open'|'timeout'|'closed'}
 */
export function netCheckPort(host, port, timeout = 5000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isDone = false;
    let guardTimer;
    const done = (result) => {
      if (isDone) return;
      isDone = true;
      clearTimeout(guardTimer);      
      socket.destroy();
      resolve(result);
    };
    guardTimer = setTimeout(() => done('timeout'), timeout + 100);
    guardTimer.unref();          
    socket.setTimeout(timeout);
    socket.once('connect', () => done('open'));
    socket.once('timeout', () => done('timeout'));
    socket.once('error',   () => done('closed'));
    socket.connect(port, host);
  });
}