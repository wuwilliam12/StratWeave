"use client";

const placeholderGraphs = [
  { title: "Pressure Southpaw Camp", desc: "Strategy analysis for southpaw opponents", updated: "2h ago", nodes: 12 },
  { title: "Outside Jab Style Shell", desc: "Reusable style blueprint for jab-focused fighters", updated: "Yesterday", nodes: 8 },
  { title: "Body Jab Counter Tree", desc: "Counter strategies for body jab attacks", updated: "3 days ago", nodes: 15 },
  { title: "Volume Punching System", desc: "High-volume combinations and patterns", updated: "1 week ago", nodes: 20 },
];

export default function PublicGraphsSection() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Public Graphs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {placeholderGraphs.map((graph) => (
          <div key={graph.title} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900">{graph.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{graph.desc}</p>
            <div className="text-xs text-gray-500 mt-2">
              <span>{graph.updated}</span>
              <span className="mx-2">•</span>
              <span>{graph.nodes} nodes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
