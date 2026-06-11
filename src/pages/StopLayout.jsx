import { Outlet, useParams, Navigate } from 'react-router-dom';
import { getStop } from '../data/stops';
import { useStopData } from '../hooks/useStopData';
import { StopDataContext } from '../context/StopDataContext';
import Layout from '../components/Layout';

export default function StopLayout() {
  const { stopId } = useParams();
  const stop = getStop(stopId);

  if (!stop) return <Navigate to="/" replace />;

  const { data, update, generateId } = useStopData(stopId);

  return (
    <StopDataContext.Provider value={{ data, update, generateId, stop }}>
      <Layout>
        <Outlet />
      </Layout>
    </StopDataContext.Provider>
  );
}
