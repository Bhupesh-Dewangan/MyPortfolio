import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config/api";

const MaintenanceContext = createContext({
  isMaintenanceMode: false,
  maintenanceTitle: "Scheduled Maintenance",
  maintenanceMessage: "We are currently upgrading and fine-tuning the portfolio. We'll be back online shortly!",
  estimatedEndTime: null,
  allowAdminBypass: true,
  isBypassed: false,
  loading: true,
  refreshStatus: () => {},
});

export const MaintenanceProvider = ({ children }) => {
  const [status, setStatus] = useState({
    isMaintenanceMode: false,
    maintenanceTitle: "Scheduled Maintenance",
    maintenanceMessage: "We are currently upgrading and fine-tuning the portfolio. We'll be back online shortly!",
    estimatedEndTime: null,
    allowAdminBypass: true,
  });
  const [loading, setLoading] = useState(true);

  // Check URL query parameters for admin bypass (?bypass=true)
  const [isBypassed, setIsBypassed] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get("bypass") === "true" || params.get("preview") === "true") {
      sessionStorage.setItem("portfolio_admin_bypass", "true");
      return true;
    }
    return sessionStorage.getItem("portfolio_admin_bypass") === "true";
  });

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings/maintenance`);
      if (res.ok) {
        const data = await res.json();
        setStatus({
          isMaintenanceMode: Boolean(data.isMaintenanceMode),
          maintenanceTitle: data.maintenanceTitle || "Scheduled Maintenance",
          maintenanceMessage:
            data.maintenanceMessage ||
            "We are currently upgrading and fine-tuning the portfolio. We'll be back online shortly!",
          estimatedEndTime: data.estimatedEndTime || null,
          allowAdminBypass: data.allowAdminBypass !== undefined ? data.allowAdminBypass : true,
        });
      }
    } catch (err) {
      // In case backend is completely unreachable or offline during maintenance
      console.warn("Could not reach settings API, assuming live mode:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    // Background polling every 25 seconds to auto-recover if admin brings site online
    const interval = setInterval(fetchStatus, 25000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Actual active shutdown state takes bypass into account
  const shouldShowMaintenance =
    status.isMaintenanceMode && (!isBypassed || !status.allowAdminBypass);

  return (
    <MaintenanceContext.Provider
      value={{
        ...status,
        shouldShowMaintenance,
        isBypassed,
        loading,
        refreshStatus: fetchStatus,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => useContext(MaintenanceContext);
export default MaintenanceContext;
