import React, { useEffect } from 'react';
import controlBoss, { ControlBoss } from './control-boss';

export default function useControlBoss(): [ControlBoss, boolean] {
  const [isInitialized, setIsInitialized] = React.useState<boolean>(controlBoss.initialized());

  useEffect(() => {
    controlBoss.awaitReady().then(() => {
      setIsInitialized(true);
    });
  }, []);

  return [controlBoss, isInitialized];
}
