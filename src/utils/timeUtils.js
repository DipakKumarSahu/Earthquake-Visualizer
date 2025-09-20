// src/utils/timeUtils.js

export function timeStr(timestamp) {
  const date = new Date(timestamp);
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return formatter.format(date);
}
