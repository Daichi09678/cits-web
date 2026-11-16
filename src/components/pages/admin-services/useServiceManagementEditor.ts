"use client";

import useServiceManagementEditorState from "./useServiceManagementEditorState";
import createServiceManagementEditorActions from "./createServiceManagementEditorActions";

export default function useServiceManagementEditor() {
  const state = useServiceManagementEditorState();
  return { ...state, ...createServiceManagementEditorActions(state) };
}

export type ServiceManagementEditorState = ReturnType<typeof useServiceManagementEditor>;
