import GraphEditor from "../features/flow/GraphEditor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <h1 className="shrink-0 px-4 py-2 text-lg font-semibold">StratWeave</h1>
      <div className="min-h-0 flex-1">
        <GraphEditor />
      </div>
    </main>
  );
}
