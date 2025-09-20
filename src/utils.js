export function magToRadius(m) {
  if (m == null || Number.isNaN(m)) return 4;
  // smooth scaling
  return Math.max(4, Math.pow(Math.max(0, m), 1.8));
}

// export function magToColor(m) {
//   if (m == null) return "#999";
//   if (m >= 6) return "#800026";
//   if (m >= 5) return "#BD0026";
//   if (m >= 4) return "#c3720b";
//   if (m >= 3) return "#d9d613";
//   if (m >= 2) return "#0428b9";
//   return "#04cd04eb";
// }

export function magToColor(m) {
  if (m == null) return "#999";
  if (m >= 6) return "#800026";
  if (m >= 5) return "#BD0026";
  if (m >= 4) return "#E31A1C";
  if (m >= 3) return "#FC4E2A";
  if (m >= 2) return "#FD8D3C";
  return "#FED976";
}

export function timeStr(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleString();
}
