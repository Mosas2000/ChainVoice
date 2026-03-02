import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Run a callback whenever the route pathname changes.
 *
 * Primary use case is closing the mobile navigation drawer when the
 * user navigates to a new page via a link inside the drawer. Without
 * this the drawer would stay open on the new route.
 */
export function useRouteChange(callback: () => void): void {
  const { pathname } = useLocation();

  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
}
