"use client";

import LandingEditor from "@/components/pages/admin-landing/LandingEditor";
import useLandingEditor from "@/components/pages/admin-landing/useLandingEditor";

export default function AdminLandingPage() {
  const editor = useLandingEditor();
  return <LandingEditor editor={editor} />;
}
