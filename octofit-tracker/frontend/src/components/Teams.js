import { useCallback, useEffect, useState } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const baseApiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
    : 'http://localhost:8000';
  const endpoint = `${baseApiUrl}/api/teams/`;

  const fetchTeams = useCallback(async () => {
    try {
      console.log('[Teams] Fetch endpoint:', endpoint);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const payload = await response.json();
      console.log('[Teams] Fetched data:', payload);

      const normalizedData = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.results)
          ? payload.results
          : [];

      setTeams(normalizedData);
      setError('');
    } catch (err) {
      console.error('[Teams] Fetch error:', err);
      setError('Unable to load teams from the API.');
    }
  }, [endpoint]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const filteredTeams = teams.filter((team) =>
    JSON.stringify(team).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="card border-0 bg-light-subtle">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
          <h2 className="resource-heading h3 mb-0">Teams</h2>
          <a href={endpoint} className="link-primary" target="_blank" rel="noreferrer">
            Open endpoint
          </a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(e) => e.preventDefault()}>
          <div className="col-sm-8 col-md-9">
            <input
              type="search"
              className="form-control"
              placeholder="Search team records"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-sm-4 col-md-3 d-grid">
            <button type="button" className="btn btn-primary" onClick={fetchTeams}>
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
              {filteredTeams.map((team, index) => (
                <tr key={team.id || team._id || index}>
                  <td>{team.id || team._id || 'N/A'}</td>
                  <td className="json-preview text-break">{JSON.stringify(team)}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setSelectedTeam(team)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTeams.length === 0 && !error ? (
          <p className="text-secondary mt-3 mb-0">No teams found.</p>
        ) : null}
      </div>

      {selectedTeam ? (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Team details</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedTeam(null)}
                  />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedTeam, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedTeam(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setSelectedTeam(null)} />
        </>
      ) : null}
    </section>
  );
}

export default Teams;
