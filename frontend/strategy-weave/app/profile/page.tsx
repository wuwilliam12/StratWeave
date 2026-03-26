"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: number;
  username: string;
  email: string;
  bio?: string | null;
  credentials?: string | null;
  join_date?: string | null;
  total_graphs?: number;
  public_graphs?: number;
}

type ProfileSectionKey = "account" | "security" | "activity" | "publicGraphs";

import ProfileSettingsLayout from "../../components/ProfileSettingsLayout";
import AccountSettings from "../../components/profile/AccountSettings";
import SecuritySettings from "../../components/profile/SecuritySettings";
import ActivitySection from "../../components/profile/ActivitySection";
import PublicGraphsSection from "../../components/profile/PublicGraphsSection";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedSection, setSelectedSection] = useState<ProfileSectionKey>("account");

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setUsername(userData.username);
        setEmail(userData.email);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      } else {
        setError("Failed to load profile");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setUpdating(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Missing authentication token");
      setUpdating(false);
      return;
    }

    try {
      const updateData: Record<string, unknown> = {
        username,
        email,
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      const response = await fetch("http://localhost:8000/api/auth/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setSuccess("Profile updated successfully");
        setNewPassword("");
        setConfirmPassword("");
        setCurrentPassword("");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Update failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please log in to view your profile</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateSecurity = async () => {
    if (!newPassword) {
      setError("Enter a new password to update security");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setUpdating(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8000/api/auth/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        setSuccess("Password updated successfully");
        setNewPassword("");
        setConfirmPassword("");
        setCurrentPassword("");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Unable to update password");
      }
    } catch {
      setError("Network error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ProfileSettingsLayout selected={selectedSection} onSelect={setSelectedSection}>
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 grid place-items-center text-2xl font-bold text-gray-700">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-3 flex gap-2">
              <Link
                href={`/users/${user.username}`}
                className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Public Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}

      {selectedSection === "account" && (
        <AccountSettings
          username={username}
          email={email}
          setUsername={setUsername}
          setEmail={setEmail}
          loading={updating}
          onSave={handleUpdateProfile}
        />
      )}

      {selectedSection === "security" && (
        <SecuritySettings
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setCurrentPassword={setCurrentPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          updating={updating}
          onChangePassword={handleUpdateSecurity}
        />
      )}

      {selectedSection === "activity" && (
        <ActivitySection
          totalGraphs={user.total_graphs || 0}
          publicGraphs={user.public_graphs || 0}
          joinDate={user.join_date}
        />
      )}

      {selectedSection === "publicGraphs" && <PublicGraphsSection />}
    </ProfileSettingsLayout>
  );
}