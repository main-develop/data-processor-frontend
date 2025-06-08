interface SampleDataProperties {
  sampleData: Record<string, any>[];
}

export default function SampleData({
  sampleData,
}: SampleDataProperties): React.JSX.Element | null {
  if (!sampleData.length) return null;

  const columns = Object.keys(sampleData[0]);

  return (
    <div className="relative">
      <div className="section-gradient-shadow"></div>
      <section className="mb-20 p-6 rounded-xl shadow-md glassmorphism">
        <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-200">
            <thead>
              <tr className="bg-gray-700/20">
                {columns.map((col) => (
                  <th key={col} className="px-4 py-2 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, idx) => (
                <tr key={idx} className="border-t border-gray-600/20">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-2">
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
