"use client";
import { BackOfficeInput as Input } from "@/components/ui/Input";

import { Search } from "lucide-react";
import type { ContactEditorState } from "./useContactEditor";

export default function ContactInboxToolbar({ editor }: { editor: ContactEditorState }) {
  const { activeTab, search, setSearch, setMessagePage } = editor;
  return (
    <>
      {activeTab === "inbox" && (
        <div className="relative order-3 w-full lg:order-none lg:w-60">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          />
          <Input
            type="search"
            aria-label="Cari pesan konsultasi"
            placeholder="Cari nama, instansi, atau pesan..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setMessagePage(1);
            }}
            fieldSize="sm"
            className="w-full"
            withIcon
          />
        </div>
      )}
    </>
  );
}
