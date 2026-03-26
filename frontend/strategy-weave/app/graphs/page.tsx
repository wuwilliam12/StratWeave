"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useGraph } from "@/contexts/GraphContext";
import Navbar from "@/components/Navbar";

export default function GraphsPage() {
  const router = useRouter();
  const { graphs, fetchGraphs, loading, error, removeGraph, createNewGraph } = useGraph();
  const [showNewGraphForm, setShowNewGraphForm] = useState(false);
  const [newGraphForm, setNewGraphForm] = useState({
    name: "",
    description: "",
    is_public: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchGraphs(false);
  }, [fetchGraphs]);

  const handleCreateGraph = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGraphForm.name.trim()) {
      toast.error("Graph name is required");
      return;
    }

    setIsSaving(true);
    try {
      const newGraph = await createNewGraph({
        name: newGraphForm.name,
        description: newGraphForm.description || null,
        is_public: newGraphForm.is_public,
        nodes: [],
        edges: [],
      });

      toast.success("Graph created!");
      setNewGraphForm({ name: "", description: "", is_public: false });
      setShowNewGraphForm(false);
      
      // Redirect to the new graph editor
      router.push(`/graph_editor/${newGraph.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create graph");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGraph = async (graphId: string, graphName: string) => {
    if (!confirm(`Are you sure you want to delete "${graphName}"?`)) {
      return;
    }

    try {
      await removeGraph(graphId);
      toast.success("Graph deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete graph");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Graphs</h1>
            <p className="text-gray-600 mt-2">Create and manage your strategy graphs</p>
          </div>
          <button
            onClick={() => setShowNewGraphForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            + New Graph
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* New Graph Form */}
        {showNewGraphForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Graph</h2>
            <form onSubmit={handleCreateGraph} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graph Name *
                </label>
                <input
                  type="text"
                  value={newGraphForm.name}
                  onChange={(e) =>
                    setNewGraphForm({ ...newGraphForm, name: e.target.value })
                  }
                  placeholder="e.g., Pressure Southpaw Camp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newGraphForm.description}
                  onChange={(e) =>
                    setNewGraphForm({ ...newGraphForm, description: e.target.value })
                  }
                  placeholder="Optional description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={newGraphForm.is_public}
                  onChange={(e) =>
                    setNewGraphForm({ ...newGraphForm, is_public: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isSaving}
                />
                <label htmlFor="is_public" className="ml-2 text-sm text-gray-700">
                  Make this graph public
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  {isSaving ? "Creating..." : "Create Graph"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewGraphForm(false);
                    setNewGraphForm({ name: "", description: "", is_public: false });
                  }}
                  disabled={isSaving}
                  className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Graphs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading graphs...</div>
          </div>
        ) : graphs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-lg mb-4">No graphs yet</p>
            <p className="text-gray-400 mb-6">Create your first strategy graph to get started</p>
            <button
              onClick={() => setShowNewGraphForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Create First Graph
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {graphs.map((graph) => (
              <div
                key={graph.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">{graph.name}</h3>
                    {graph.is_public && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Public
                      </span>
                    )}
                  </div>
                  {graph.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {graph.description}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <Link
                      href={`/graph_editor/${graph.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-center font-medium transition text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteGraph(graph.id, graph.name)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg font-medium transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
