"use client";

import { createContext, useContext } from "react";

export type InputState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  interactNonce: number;
  closeNonce: number;
};

export const defaultInputState: InputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false,
  interactNonce: 0,
  closeNonce: 0,
};

export const InputContext = createContext<InputState>(defaultInputState);

export function useInputState() {
  return useContext(InputContext);
}
