import { createContext, useContext } from 'react';

export const StopDataContext = createContext(null);

export function useStopContext() {
  return useContext(StopDataContext);
}
