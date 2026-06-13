"use client";

import { type ReactNode, useEffect, useState } from "react";
import { InputContext, defaultInputState, type InputState } from "@/components/systems/useInputState";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const movementKeys: Record<string, keyof Pick<InputState, "forward" | "backward" | "left" | "right" | "sprint">> = {
  w: "forward",
  arrowup: "forward",
  s: "backward",
  arrowdown: "backward",
  a: "left",
  arrowleft: "left",
  d: "right",
  arrowright: "right",
  shift: "sprint",
};

function resetMovementFlags(): Pick<InputState, "forward" | "backward" | "left" | "right" | "sprint"> {
  return {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  };
}

export function InputProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState<InputState>(defaultInputState);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable === true;

      if (key === "e") {
        if (event.repeat || isTyping) return;
        if (usePortfolioStore.getState().isOverlayOpen) return;
        setInput((state) => ({ ...state, interactNonce: state.interactNonce + 1 }));
        return;
      }

      if (key === "escape") {
        if (event.repeat || isTyping) return;
        setInput((state) => ({ ...state, closeNonce: state.closeNonce + 1 }));
        return;
      }

      const intent = movementKeys[key];
      if (intent) {
        const { isOverlayOpen, isTransitioning } = usePortfolioStore.getState();
        if (isOverlayOpen || isTransitioning) return;
        event.preventDefault();
        setInput((state) => ({ ...state, [intent]: true }));
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      const intent = movementKeys[event.key.toLowerCase()];
      if (intent) {
        setInput((state) => ({ ...state, [intent]: false }));
      }
    }

    function resetMovement() {
      setInput((state) => ({ ...state, ...resetMovementFlags() }));
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") resetMovement();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", resetMovement);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", resetMovement);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    return usePortfolioStore.subscribe((state, previousState) => {
      const overlayOpened = state.isOverlayOpen && !previousState.isOverlayOpen;
      const transitionStarted = state.isTransitioning && !previousState.isTransitioning;

      if (overlayOpened || transitionStarted) {
        setInput((current) => ({ ...current, ...resetMovementFlags() }));
      }
    });
  }, []);

  return <InputContext.Provider value={input}>{children}</InputContext.Provider>;
}
