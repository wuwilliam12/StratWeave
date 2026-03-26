import GraphEditor from "@/features/flow/GraphEditor";

export default function GraphEditorPage({
  params,
}: {
  params: { graphId: string };
}) {
  return (
    <main className="flex min-h-dvh h-screen flex-col">
      <div className="min-h-0 flex-1">
        <GraphEditor graphId={params.graphId} />
      </div>
    </main>
  );
}
