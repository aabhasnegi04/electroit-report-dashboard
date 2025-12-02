// Returns fontSize (px) and cellPadding (px) based on number of columns.
// Keeps text readable by clamping within sensible bounds.
export function getTableDensity(columnCount) {
  const minFont = 10.5
  const maxFont = 13
  const minPad = 6
  const maxPad = 12

  if (!columnCount || columnCount <= 8) {
    return { fontSize: maxFont, cellPadding: maxPad }
  }

  if (columnCount >= 24) {
    return { fontSize: minFont, cellPadding: minPad }
  }

  // Linear interpolation between bounds for 9..23 columns
  const t = (columnCount - 8) / (24 - 8)
  const fontSize = maxFont + (minFont - maxFont) * t
  const cellPadding = maxPad + (minPad - maxPad) * t
  return { fontSize, cellPadding }
}


