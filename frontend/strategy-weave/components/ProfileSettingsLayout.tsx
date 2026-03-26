"use client";

import { ReactNode } from "react";

type ProfileSectionKey = "account" | "security" | "activity" | "publicGraphs";

interface SidebarItem {
  key: ProfileSectionKey;
  label: string;
  subtitle: string;
}

const items: SidebarItem[] = [
  { key: "account", label: "Account", subtitle: "Username, email, and profile details" },
  { key: "security", label: "Security", subtitle: "Change password and authentication" },
  { key: "activity", label: "Activity", subtitle: "Recent actions and stats" },
  { key: "publicGraphs", label: "Public Graphs", subtitle: "Shared strategy graphs" },
];

interface ProfileSettingsLayoutProps {
  selected: ProfileSectionKey;
  onSelect: (section: ProfileSectionKey) => void;
  children: ReactNode;
}

export function isProfileSectionKey(value: string): value is ProfileSectionKey {
  return ["account", "security", "activity", "publicGraphs"].includes(value);
}

export default function ProfileSettingsLayout({ selected, onSelect, children }: ProfileSettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">
          <aside className="bg-white rounded-lg shadow p-4 sticky top-5 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Settings</h2>
            <p className="text-sm text-gray-500 mb-6">Pick a section to configure your profile.</p>
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelect(item.key)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    selected === item.key
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "hover:bg-gray-100 border-transparent text-gray-700"
                  }`}>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.subtitle}</div>
                </button>
              ))}
            </div>
          </aside>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
