"use client";

import useContactEditorState from "./useContactEditorState";
import createContactReplyActions from "./createContactReplyActions";
import createContactSettingsActions from "./createContactSettingsActions";
import createContactMessageActions from "./createContactMessageActions";

export default function useContactEditor() {
  const state = useContactEditorState();
  return {
    ...state,
    ...createContactReplyActions(state),
    ...createContactSettingsActions(state),
    ...createContactMessageActions(state),
  };
}

export type ContactEditorState = ReturnType<typeof useContactEditor>;
