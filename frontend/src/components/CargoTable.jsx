import { useAuth } from "../context/AuthContext";
import { convertWeight, sortCargo } from "../utils/cargoUtils";

export default function CargoTable({ records }) {
  const { isAdmin } = useAuth();
  const sorted = sortCargo(records);

  return (
    <div className="overflow-x-auto rounded border border-space-600">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-space-700 border-b border-space-600">
            <th className="text-left px-4 py-3 text-amber-500 font-mono text-xs uppercase tracking-widest">
              Cargo ID
            </th>
            <th className="text-left px-4 py-3 text-amber-500 font-mono text-xs uppercase tracking-widest">
              Destination
            </th>
            <th className="text-right px-4 py-3 text-amber-500 font-mono text-xs uppercase tracking-widest">
              Weight
            </th>
            <th className="text-left px-4 py-3 text-amber-500 font-mono text-xs uppercase tracking-widest">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((record, idx) => {
            const isEarth = record.destination === "Earth";
            const { value, unit } = convertWeight(record.weight, isAdmin);

            return (
              <tr
                key={record.cargo_id}
                className={[
                  "border-b border-space-700 transition-colors duration-150",
                  isEarth
                    ? "bg-space-800 opacity-60 italic"
                    : idx % 2 === 0
                      ? "bg-space-900 hover:bg-space-700"
                      : "bg-space-800 hover:bg-space-700",
                ].join(" ")}
              >
                <td className="px-4 py-3">
                  <span className="cargo-id">{record.cargo_id}</span>
                </td>
                <td className="px-4 py-3 text-slate-300 font-ui">
                  {record.destination}
                  {isEarth && (
                    <span className="ml-2 text-xs text-slate-500 font-mono">
                      [PINNED]
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  <span className="text-slate-100">{value}</span>
                  <span className="ml-1 text-xs text-amber-500">{unit}</span>
                </td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                  {record.date}
                </td>
              </tr>
            );
          })}

          {sorted.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-10 text-center text-slate-500 font-mono text-xs"
              >
                NO CARGO RECORDS FOUND. UPLOAD A MANIFEST.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
