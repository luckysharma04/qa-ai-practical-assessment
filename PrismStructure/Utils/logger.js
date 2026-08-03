/**
 * Lightweight console logger for API/UI debug (no secrets).
 */
function logStep(message) {
  console.log(`[STEP] ${message}`);
}

function logApi(method, path, status) {
  console.log(`[API] ${method} ${path} → ${status}`);
}

module.exports = { logStep, logApi };
