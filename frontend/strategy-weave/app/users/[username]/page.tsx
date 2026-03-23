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

  const [user, setUser] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600 mt-1">{user.email}</p>

              {user.bio && (
                <p className="text-gray-700 mt-3">{user.bio}</p>
              )}

              {user.credentials && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {user.credentials}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{user.total_graphs}</div>
              <div className="text-gray-600 mt-1">Total Graphs</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{user.public_graphs}</div>
              <div className="text-gray-600 mt-1">Public Graphs</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {user.join_date ? new Date(user.join_date).getFullYear() : "2024"}
              </div>
              <div className="text-gray-600 mt-1">Member Since</div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Placeholder activities */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Created new strategy graph "Pressure Southpaw"</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Updated opponent analysis for "Shadow Boxer"</p>
                <p className="text-xs text-gray-500">1 week ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Published style blueprint "Outside Jab System"</p>
                <p className="text-xs text-gray-500">2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Public Graphs Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Public Graphs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Placeholder graphs */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900">Pressure Southpaw Camp</h3>
              <p className="text-sm text-gray-600 mt-1">Strategy analysis for southpaw opponents</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span>Updated 2h ago</span>
                <span className="mx-2">•</span>
                <span>12 nodes</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900">Outside Jab Style Shell</h3>
              <p className="text-sm text-gray-600 mt-1">Reusable style blueprint for jab-focused fighters</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span>Updated yesterday</span>
                <span className="mx-2">•</span>
                <span>8 nodes</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900">Body Jab Counter Tree</h3>
              <p className="text-sm text-gray-600 mt-1">Counter strategies for body jab attacks</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span>Updated 3 days ago</span>
                <span className="mx-2">•</span>
                <span>15 nodes</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900">Volume Punching System</h3>
              <p className="text-sm text-gray-600 mt-1">High-volume combinations and patterns</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span>Updated 1 week ago</span>
                <span className="mx-2">•</span>
                <span>20 nodes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link
            href="/home"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}