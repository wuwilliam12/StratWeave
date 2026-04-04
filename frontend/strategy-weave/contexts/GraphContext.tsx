/**
 * Graph Storage Context for React
 * Manages fetching, storing, and updating user graphs
 */

"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  listGraphs,
  createGraph,
  getGraph,
  updateGraph,
  deleteGraph,
  GraphSummary,
  GraphResponse,
  GraphCreate,
} from "@/lib/graphApi";

interface GraphContextType {
  graphs: GraphSummary[];
  currentGraph: GraphResponse | null;
  loading: boolean;
  error: string | null;

  // Operations
  fetchGraphs: (includePublic?: boolean) => Promise<void>;
  createNewGraph: (payload: GraphCreate) => Promise<GraphResponse>;
  openGraph: (graphId: string) => Promise<void>;
  saveGraph: (payload: GraphCreate) => Promise<void>;
  removeGraph: (graphId: string) => Promise<void>;
  clearError: () => void;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export function GraphProvider({ children }: { children: ReactNode }) {
  const [graphs, setGraphs] = useState<GraphSummary[]>([]);
  const [currentGraph, setCurrentGraph] = useState<GraphResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : "Unknown error";
    setError(message);
    console.error("Graph operation failed:", message);
  };

  const fetchGraphs = useCallback(async (includePublic = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await listGraphs(includePublic);
      setGraphs(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewGraph = useCallback(async (payload: GraphCreate) => {
    try {
      setLoading(true);
      setError(null);
      const graph = await createGraph(payload);
      setGraphs((prev) => [
        ...prev,
        {
          id: graph.id,
          name: graph.name,
          description: graph.description,
          owner_id: graph.owner_id,
          is_public: graph.is_public,
        },
      ]);
      return graph;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const openGraph = useCallback(async (graphId: string) => {
    try {
      setLoading(true);
      setError(null);
      const graph = await getGraph(graphId);
      setCurrentGraph(graph);
    } catch (err) {
      handleError(err);
      setCurrentGraph(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveGraph = useCallback(async (payload: GraphCreate) => {
    if (!currentGraph) {
      throw new Error("No graph currently open");
    }
    try {
      setLoading(true);
      setError(null);
      const updated = await updateGraph(currentGraph.id, payload);
      setCurrentGraph(updated);
      // Update the summary in the list
      setGraphs((prev) =>
        prev.map((g) =>
          g.id === currentGraph.id
            ? {
                ...g,
                name: payload.name,
                description: payload.description,
                is_public: payload.is_public,
              }
            : g
        )
      );
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentGraph]);

  const removeGraph = useCallback(async (graphId: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteGraph(graphId);
      setGraphs((prev) => prev.filter((g) => g.id !== graphId));
      if (currentGraph?.id === graphId) {
        setCurrentGraph(null);
      }
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentGraph]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <GraphContext.Provider
      value={{
        graphs,
        currentGraph,
        loading,
        error,
        fetchGraphs,
        createNewGraph,
        openGraph,
        saveGraph,
        removeGraph,
        clearError,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error("useGraph must be used within GraphProvider");
  }
  return context;
}
