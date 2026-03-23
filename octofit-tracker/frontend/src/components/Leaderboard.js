import { useCallback, useEffect, useState } from 'react';

function Leaderboard() {
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const endpointTemplate = 'https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/leaderboard/';
  const endpoint = endpointTemplate.replace(
    '$REACT_APP_CODESPACE_NAME',
    process.env.REACT_APP_CODESPACE_NAME || 'localhost'
  );

  const fetchLeaderboard = useCallback(async () => {
    try {
      console.log('[Leaderboard] Fetch endpoint:', endpoint);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const payload = await response.json();
      console.log('[Leaderboard] Fetched data:', payload);

      const normalizedData = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.results)
          ? payload.results
          : [];

      setLeaderboardEntries(normalizedData);
      setError('');
    } catch (err) {
      console.error('[Leaderboard] Fetch error:', err);
      setError('Unable to load leaderboard data from the API.');
    }
  }, [endpoint]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const filteredEntries = leaderboardEntries.filter((entry) =>
    JSON.stringify(entry).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="card border-0 bg-light-subtle">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
          <h2 className="resource-heading h3 mb-0">Leaderboard</h2>
          <a href={endpoint} className="link-primary" target="_blank" rel="noreferrer">
            Open endpoint
          </a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(e) => e.preventDefault()}>
          <div className="col-sm-8 col-md-9">
            <input
              type="search"
              className="form-control"
              placeholder="Search leaderboard records"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-sm-4 col-md-3 d-grid">
            <button type="button" className="btn btn-primary" onClick={fetchLeaderboard}>
              Refresh
            </button>
          </div>
        </form>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle resource-table mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Record</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, index) => (
                <tr key={entry.id || entry._id || index}>
                  <td>{entry.id || entry._id || 'N/A'}</td>
                  <td className="json-preview text-break">{JSON.stringify(entry)}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && !error ? (
          <p className="text-secondary mt-3 mb-0">No leaderboard entries found.</p>
        ) : null}
      </div>

      {selectedEntry ? (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Leaderboard entry details</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedEntry(null)}
                  />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedEntry, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedEntry(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setSelectedEntry(null)} />
        </>
      ) : null}
    </section>
  );
}

export default Leaderboard;
