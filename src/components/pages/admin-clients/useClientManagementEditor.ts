"use client";

import useClientManagementEditorState from "./useClientManagementEditorState";
import createClientManagementEditorActions from "./createClientManagementEditorActions";

export default function useClientManagementEditor() {
  const state = useClientManagementEditorState();
  return { ...state, ...createClientManagementEditorActions(state) };
}

export type ClientManagementEditorState = ReturnType<typeof useClientManagementEditor>;
