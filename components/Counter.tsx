"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Counter() {
  const [count, setCount] = useState<number | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const client = io({ path: "/socket.io" });

    client.on("counter", (value: number) => {
      setCount(value);
    });

    setSocket(client);

    return () => {
      client.disconnect();
    };
  }, []);

  return (
    <div>
      <p>
        Counter:{" "}
        <strong>{count === null ? "connecting…" : count}</strong>
      </p>
      <button
        type="button"
        onClick={() => socket?.emit("increment")}
        disabled={!socket}
      >
        Increment
      </button>
      <p style={{ fontSize: "0.85rem", color: "#666" }}>
        Open two tabs on the same tenant URL and click Increment in one tab.
      </p>
    </div>
  );
}
