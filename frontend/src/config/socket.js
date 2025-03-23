import socket from "socket.io-client";

let socketInstance = null;

export function initailizeSocket(projectId) {
  socketInstance = socket(import.meta.env.VITE_BASEURL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
  });

  return socketInstance;
}

export function receiveMessage(eventName, cb) {
  socketInstance.on(eventName, cb);
}

export function sendMessage(eventName, data) {
  socketInstance.emit(eventName, data);
}
