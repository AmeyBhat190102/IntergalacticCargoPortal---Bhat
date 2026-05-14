/**
 * Sort cargo records: heaviest → lightest, with Earth always pinned to bottom.
 * CRG-008 (Earth, 9999kg) would be #1 by weight — must be last regardless.
 */
export function sortCargo(records) {
  const earth = records.filter((r) => r.destination === "Earth");
  const others = records.filter((r) => r.destination !== "Earth");
  others.sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
  return [...others, ...earth];
}

/**
 * Convert weight for display based on role.
 * Admin → KG (raw value, 2 decimal places)
 * Standard → LBS (weight × 2.20462, 2 decimal places)
 */
export function convertWeight(weight, isAdmin) {
  const kg = parseFloat(weight);
  if (isAdmin) {
    return { value: kg.toFixed(2), unit: "KG" };
  }
  return { value: (kg * 2.20462).toFixed(2), unit: "LBS" };
}
