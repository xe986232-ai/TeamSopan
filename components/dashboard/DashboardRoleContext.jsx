"use client";

import { createContext, useContext } from "react";

const DashboardRoleContext = createContext(null);

// role: { type: "master", division: null } | { type: "division", division: "remix" } | null
export function DashboardRoleProvider({ role, children }) {
  return (
    <DashboardRoleContext.Provider value={role}>
      {children}
    </DashboardRoleContext.Provider>
  );
}

export function useDashboardRole() {
  return useContext(DashboardRoleContext);
}
