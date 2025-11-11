export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCredits(credits) {
  return formatNumber(credits);
}

export function formatStorage(tb) {
  return `${tb.toFixed(1)} TB`;
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

