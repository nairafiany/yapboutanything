"use client";

import { useCallback, useEffect, useState } from "react";

const initial = { explored: [], completed: [], thinkTime: 30, yapTime: 120, sound: true, hasInteracted: false, reflections: {} };

export function useLocalProgress() {
  const [progress, setProgress] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hydrate = window.setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("yap-progress") || "null");
        if (stored) setProgress({ ...initial, ...stored });
      } catch {}
      setReady(true);
    }, 0);
    return () => window.clearTimeout(hydrate);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("yap-progress", JSON.stringify(progress));
  }, [progress, ready]);

  const patch = useCallback((value) => setProgress((prev) => ({ ...prev, ...value })), []);
  const explore = useCallback((id) => setProgress((p) => ({ ...p, hasInteracted: true, explored: [...new Set([...p.explored, id])] })), []);
  const complete = useCallback((id) => setProgress((p) => ({ ...p, completed: [...new Set([...p.completed, id])] })), []);
  const reflect = useCallback((id, feeling) => setProgress((p) => ({ ...p, reflections: { ...p.reflections, [id]: feeling } })), []);

  return { progress, patch, explore, complete, reflect, ready };
}
