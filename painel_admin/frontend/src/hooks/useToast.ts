import { useEffect, useState } from "react";

export interface Toast {
  id: number;
  kind: "ok" | "err";
  msg: string;
}

const listeners = new Set<(t: Toast[]) => void>();
let stack: Toast[] = [];
let nextId = 1;

function publish() {
  for (const l of listeners) l([...stack]);
}

export function toast(kind: "ok" | "err", msg: string, ttlMs = 3200) {
  const id = nextId++;
  stack = [...stack, { id, kind, msg }];
  publish();
  setTimeout(() => {
    stack = stack.filter((t) => t.id !== id);
    publish();
  }, ttlMs);
}

export function useToasts(): Toast[] {
  const [list, setList] = useState<Toast[]>(stack);
  useEffect(() => {
    listeners.add(setList);
    return () => {
      listeners.delete(setList);
    };
  }, []);
  return list;
}
