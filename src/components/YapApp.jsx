"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { rootNode, findPath } from "@/content/universe";
import { useLocalProgress } from "@/hooks/useLocalProgress";
import KnowledgeUniverse from "./universe/KnowledgeUniverse";
import YapSetup from "./practice/YapSetup";
import SessionTimer from "./practice/SessionTimer";
import CompletionScreen from "./practice/CompletionScreen";
import ShareModal from "./share/ShareModal";

function collectPrompts(item, results = []) {
  item.prompts?.forEach((prompt) => results.push({ prompt, path: findPath(item.id) }));
  item.children?.forEach((child) => collectPrompts(child, results));
  return results;
}

export default function YapApp() {
  const [path, setPath] = useState([rootNode]);
  const [phase, setPhase] = useState("universe");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const { progress, patch, explore, complete, reflect } = useLocalProgress();
  const allPrompts = useMemo(() => collectPrompts(rootNode), []);

  const enter = useCallback((item) => {
    explore(item.id);
    setPath((p) => [...p, item]);
    window.history.pushState({ node: item.id }, "", `#${item.id}`);
  }, [explore]);
  const jump = useCallback((index) => { setPath((p) => p.slice(0, index + 1)); window.history.pushState({}, "", index ? `#${path[index]?.id}` : location.pathname); }, [path]);
  const random = useCallback(() => {
    const next = allPrompts[Math.floor(Math.random() * allPrompts.length)];
    setPath(next.path); setSelectedPrompt(next.prompt); setPhase("setup"); explore(next.path.at(-1).id);
  }, [allPrompts, explore]);

  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") phase === "universe" && path.length > 1 ? jump(path.length - 2) : phase !== "universe" && setPhase("universe"); };
    const onPop = () => setPath((p) => p.length > 1 ? p.slice(0, -1) : p);
    window.addEventListener("keydown", onKey); window.addEventListener("popstate", onPop);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("popstate", onPop); };
  }, [path, phase, jump]);

  const choosePrompt = (prompt) => { setSelectedPrompt(prompt); setPhase("setup"); };
  const done = () => { complete(selectedPrompt.id); setPhase("complete"); };
  const another = () => random();

  return <>
    <AnimatePresence mode="wait">
      {phase === "universe" && <KnowledgeUniverse key="universe" path={path} explored={progress.explored} hasInteracted={progress.hasInteracted} onEnter={enter} onJump={jump} onPrompt={choosePrompt} onRandom={random} />}
      {phase === "setup" && <YapSetup key="setup" prompt={selectedPrompt} thinkTime={progress.thinkTime} yapTime={progress.yapTime} sound={progress.sound} onChange={patch} onStart={() => setPhase("think")} onBack={() => setPhase("universe")} />}
      {phase === "think" && <SessionTimer key="think" mode="think" duration={progress.thinkTime} prompt={selectedPrompt} sound={progress.sound} onDone={() => setPhase("yap")} onExit={() => setPhase("setup")} />}
      {phase === "yap" && <SessionTimer key="yap" mode="yap" duration={progress.yapTime} prompt={selectedPrompt} sound={progress.sound} onDone={done} onExit={() => setPhase("setup")} />}
      {phase === "complete" && <CompletionScreen key="complete" prompt={selectedPrompt} yapTime={progress.yapTime} feeling={progress.reflections[selectedPrompt.id]} onFeel={(value) => reflect(selectedPrompt.id, value)} onAgain={() => setPhase("think")} onAnother={another} onUniverse={() => setPhase("universe")} onShare={() => setShareOpen(true)} />}
    </AnimatePresence>
    {shareOpen && <ShareModal prompt={selectedPrompt} path={path} thinkTime={progress.thinkTime} yapTime={progress.yapTime} onClose={() => setShareOpen(false)} />}
  </>;
}
