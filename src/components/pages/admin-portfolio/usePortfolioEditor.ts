"use client";

import usePortfolioEditorState from "./usePortfolioEditorState";
import createPortfolioEditorActions from "./createPortfolioEditorActions";

export default function usePortfolioEditor() {
  const state = usePortfolioEditorState();
  return { ...state, ...createPortfolioEditorActions(state) };
}

export type PortfolioEditorState = ReturnType<typeof usePortfolioEditor>;
