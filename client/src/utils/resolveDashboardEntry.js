/**
 * JWT payload decode (no verify). Used only to read `roles` and `exp` for routing.
 */
function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(b64 + pad);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isExpired(payload) {
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
}

/**
 * Where "Get in touch" / account entry should send the visitor.
 * Priority: valid admin session → admin dashboard; manager → manager; guest user → user dashboard.
 * Otherwise a page to pick a login.
 */
export function resolveGetInTouchTo() {
  const adminToken = localStorage.getItem("adminAccessToken");
  const managerToken = localStorage.getItem("managerAccessToken");
  const userToken = localStorage.getItem("accessToken");

  if (adminToken) {
    const p = decodeJwtPayload(adminToken);
    if (p && !isExpired(p) && Array.isArray(p.roles) && p.roles.includes("ADMIN")) {
      return "/admin/dashboard";
    }
  }
  if (managerToken) {
    const p = decodeJwtPayload(managerToken);
    if (p && !isExpired(p) && Array.isArray(p.roles) && p.roles.includes("MANAGER")) {
      return "/manager/dashboard";
    }
  }
  if (userToken) {
    const p = decodeJwtPayload(userToken);
    if (p && !isExpired(p)) {
      return "/dashboard";
    }
  }

  return "/account";
}
