import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

export const useAnalytics = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!window.location.href.includes('localhost')) {
      ReactGA.initialize('UA-226922633-1');
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!window.location.href.includes('localhost') && initialized) {
      ReactGA.pageview(location.pathname);
    }
  }, [initialized, location]);
};
