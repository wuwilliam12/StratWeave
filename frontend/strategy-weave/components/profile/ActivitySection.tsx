"use client";

interface ActivitySectionProps {
  totalGraphs: number;
  publicGraphs: number;
  joinDate?: string | null;
}

const activities = [
  { text: 'Created new strategy graph "Pressure Southpaw"', when: '2 days ago' },
  { text: 'Updated opponent analysis for "Shadow Boxer"', when: '1 week ago' },
  { text: 'Published style blueprint "Outside Jab System"', when: '2 weeks ago' },
];

export default function ActivitySection({ totalGraphs, publicGraphs, joinDate }: ActivitySectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Activity Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="p-4 bg-indigo-50 rounded-lg text-center">
          <div className="text-2xl font-bold text-indigo-600">{totalGraphs}</div>
          <div className="text-sm text-gray-600">Total Graphs</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{publicGraphs}</div>
          <div className="text-sm text-gray-600">Public Graphs</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{joinDate ? new Date(joinDate).getFullYear() : '—'}</div>
          <div className="text-sm text-gray-600">Member Since</div>
        </div>
      </div>

      <div className="space-y-3">
        {activities.map((event, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-900">{event.text}</p>
            <p className="text-xs text-gray-500">{event.when}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
