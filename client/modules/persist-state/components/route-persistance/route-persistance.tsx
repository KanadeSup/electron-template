import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePersistStateStore } from "../../stores/persist-state-store";

export function RoutePersistance() {
  const location = useLocation();
  const persistStateActions = usePersistStateStore((state) => state.actions);
  const lastRoute = usePersistStateStore((state) => state.lastRoute);
  const isInitializedRef = useRef(false);
  const navigate = useNavigate();

  // Restore the route in first time application is loaded
  useEffect(() => {
    const isInitialized = isInitializedRef.current;
    if (isInitialized) return;
    isInitializedRef.current = true;

    if (lastRoute) {
      navigate(lastRoute);
    }
  }, [lastRoute, navigate]);

  // When the route changes, save the route to the store
  useEffect(() => {
    persistStateActions.setLastPage(location.pathname);
  }, [location.pathname, persistStateActions]);

  return null;
}
