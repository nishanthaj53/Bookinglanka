/**
 * Nested admin nav: groups with optional `children` (dropdown in top bar + sidebar).
 */
export const ADMIN_NAV = [
  {
    label: "Hotels",
    children: [
      { to: "/admin/dashboard/hotels/active", label: "Active" },
      { to: "/admin/dashboard/hotels/draft", label: "Draft" },
    ],
  },
  { to: "/admin/dashboard/bookings", label: "Bookings", icon: "icon-calendar" },
  {
    label: "Members",
    children: [
      { to: "/admin/dashboard/members/users", label: "Users" },
      { to: "/admin/dashboard/members/managers", label: "Managers" },
    ],
  },
  { to: "/admin/dashboard/destinations", label: "Destinations", icon: "icon-location" },
  { to: "/admin/dashboard/commission", label: "Commission", icon: "icon-chart" },
  { to: "/admin/dashboard/revenue", label: "Revenue", icon: "icon-chart" },
];

export function filterAdminNav(items, query) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items
    .map((item) => {
      if (item.children) {
        const children = item.children.filter(
          (c) => c.label.toLowerCase().includes(q) || (c.to || "").toLowerCase().includes(q)
        );
        if (children.length) return { ...item, children };
        if (item.label.toLowerCase().includes(q)) return item;
        return null;
      }
      if (item.label.toLowerCase().includes(q) || (item.to || "").toLowerCase().includes(q)) {
        return item;
      }
      return null;
    })
    .filter(Boolean);
}

export function adminNavPathIsActive(pathname, item) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (item.to) {
    return path === item.to || path.startsWith(`${item.to}/`);
  }
  if (item.children) {
    return item.children.some((c) => path === c.to || path.startsWith(`${c.to}/`));
  }
  return false;
}
