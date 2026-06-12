import { Link, Outlet, useParams, Navigate } from 'react-router-dom';
import { getStop } from '../data/stops';
import { useStopData } from '../hooks/useStopData';
import { StopDataContext } from '../context/StopDataContext';
import Layout from '../components/Layout';

function StopDataStatus({ stop, title, message, onRetry }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-md">
        <p className="text-xs font-semibold text-pgu-gold uppercase tracking-widest mb-2">
          {stop.label}
        </p>
        <h1 className="text-xl font-bold text-pgu-navy">{title}</h1>
        {message && <p className="text-sm text-pgu-gray mt-2">{message}</p>}
        <div className="flex gap-3 mt-5">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-pgu-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pgu-gold-light transition-colors cursor-pointer"
            >
              Retry
            </button>
          )}
          <Link
            to="/"
            className="bg-gray-100 text-pgu-navy px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            All Stops
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StopLayout() {
  const { stopId } = useParams();
  const stop = getStop(stopId);

  if (!stop) return <Navigate to="/" replace />;

  return <StopDataRoute stopId={stopId} stop={stop} />;
}

function StopDataRoute({ stopId, stop }) {
  const { data, loading, error, reload, update, generateId } = useStopData(stopId);

  if (loading) {
    return (
      <StopDataStatus
        stop={stop}
        title="Loading shared data..."
        message="Connecting to the PGU Supabase database."
      />
    );
  }

  if (error || !data) {
    return (
      <StopDataStatus
        stop={stop}
        title="Shared database unavailable"
        message={error || 'No data was returned for this stop.'}
        onRetry={reload}
      />
    );
  }

  return (
    <StopDataContext.Provider value={{ data, update, generateId, stop }}>
      <Layout>
        <Outlet />
      </Layout>
    </StopDataContext.Provider>
  );
}
