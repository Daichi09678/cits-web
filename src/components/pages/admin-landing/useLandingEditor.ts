"use client";

import useLandingEditorState from "./useLandingEditorState";
import createLandingClientActions from "./createLandingClientActions";
import createLandingContentActions from "./createLandingContentActions";

export default function useLandingEditor() {
  const state = useLandingEditorState();
  return { ...state, ...createLandingClientActions(state), ...createLandingContentActions(state) };
}

export type LandingEditorState = ReturnType<typeof useLandingEditor>;
