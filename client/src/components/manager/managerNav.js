/** Manager portal routes — all under /manager/dashboard (auth required). */
export const MANAGER_ROUTES = {
  bookings: "/manager/dashboard/bookings",
  hotelsActive: "/manager/dashboard/hotels/active",
  hotelsInactive: "/manager/dashboard/hotels/inactive",
  hotelsNew: "/manager/dashboard/hotels/new",
  income: "/manager/dashboard/income",
  payoutAccount: "/manager/dashboard/payout-account",
};

export const MANAGER_HEADER_LINKS = [
  { to: MANAGER_ROUTES.bookings, label: "Our Bookings" },
  { to: MANAGER_ROUTES.hotelsActive, label: "Active Hotels" },
  { to: MANAGER_ROUTES.hotelsInactive, label: "Inactive Hotels" },
  { to: MANAGER_ROUTES.hotelsNew, label: "Create Hotel" },
  { to: MANAGER_ROUTES.income, label: "Income" },
  { to: MANAGER_ROUTES.payoutAccount, label: "Payout Account" },
];

/** Highlights nav when pathname matches route or related sub-routes (e.g. manage rooms). */
export function isManagerNavActive(to, pathname) {
  if (to === MANAGER_ROUTES.hotelsActive) {
    if (pathname === MANAGER_ROUTES.hotelsActive) return true;
    return /\/manager\/dashboard\/hotels\/[^/]+\/rooms(?:\/|$)/.test(pathname);
  }
  if (to === MANAGER_ROUTES.hotelsInactive) return pathname === MANAGER_ROUTES.hotelsInactive;
  if (to === MANAGER_ROUTES.hotelsNew) return pathname === MANAGER_ROUTES.hotelsNew;
  if (to === MANAGER_ROUTES.bookings) return pathname === MANAGER_ROUTES.bookings || pathname.startsWith(`${MANAGER_ROUTES.bookings}/`);
  if (to === MANAGER_ROUTES.income) return pathname === MANAGER_ROUTES.income;
  if (to === MANAGER_ROUTES.payoutAccount) return pathname === MANAGER_ROUTES.payoutAccount;
  return pathname === to;
}
