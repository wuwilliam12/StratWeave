"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface UserPublic {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  credentials: string | null;
  join_date: string | null;
  last_active: string | null;
  total_graphs: number;
  public_graphs: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  type SectionKey = "overview" | "stats" | "activity" | "publicGraphs";

  const [user, setUser] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSection, setSelectedSection] = useState<SectionKey>("overview");

  useEffect(() => {
    if (username) {
      fetchUser();
    }
  }, [username]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/auth/users/${username}`);

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 404) {
        setError("User not found");
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/home" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className="bg-white rounded-lg shadow-sm p-4 sticky top-5">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto flex items-center justify-center text-3xl font-bold text-gray-600">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-3 font-semibold text-lg text-gray-900">{user.username}</h2>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <div className="space-y-2">
              {(
                [
                  ["overview", "Overview"],
                  ["stats", "Stats"],
                  ["activity", "Activity"],
                  ["publicGraphs", "Public Graphs"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSection(key)}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedSection === key
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </aside>

          <main>
            {selectedSection === "overview" && (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
                {user.bio && <p className="text-gray-700">{user.bio}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-600">{user.total_graphs}</div>
                    <div className="text-xs text-gray-500">Total Graphs</div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{user.public_graphs}</div>
                    <div className="text-xs text-gray-500">Public Graphs</div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{user.join_date ? new Date(user.join_date).getFullYear() : "—"}</div>
                    <div className="text-xs text-gray-500">Member Since</div>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === "stats" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-indigo-50 text-center">
                    <div className="text-3xl font-bold text-indigo-600">{user.total_graphs}</div>
                    <div className="text-sm text-gray-600">Total Graphs</div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 text-center">
                    <div className="text-3xl font-bold text-green-600">{user.public_graphs}</div>
                    <div className="text-sm text-gray-600">Public Graphs</div>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50 text-center">
                    <div className="text-3xl font-bold text-purple-600">{user.join_date ? new Date(user.join_date).getFullYear() : "—"}</div>
                    <div className="text-sm text-gray-600">Member Since</div>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === "activity" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-900">Created new strategy graph &quot;Pressure Southpaw&quot;</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-900">Updated opponent analysis for &quot;Shadow Boxer&quot;</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-900">Published style blueprint &quot;Outside Jab System&quot;</p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === "publicGraphs" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Public Graphs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">Pressure Southpaw Camp</h3>
                    <p className="text-sm text-gray-600 mt-1">Strategy analysis for southpaw opponents</p>
                    <p className="text-xs text-gray-500 mt-2">2h ago • 12 nodes</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">Outside Jab Style Shell</h3>
                    <p className="text-sm text-gray-600 mt-1">Reusable style blueprint for jab-focused fighters</p>
                    <p className="text-xs text-gray-500 mt-2">Yesterday • 8 nodes</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 text-right">
              <Link
                href="/home"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                ← Back to Home
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}