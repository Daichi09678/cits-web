"use client";

import useProductManagementEditorState from "./useProductManagementEditorState";
import createProductManagementEditorActions from "./createProductManagementEditorActions";

export default function useProductManagementEditor() {
  const state = useProductManagementEditorState();
  return { ...state, ...createProductManagementEditorActions(state) };
}

export type ProductManagementEditorState = ReturnType<typeof useProductManagementEditor>;
