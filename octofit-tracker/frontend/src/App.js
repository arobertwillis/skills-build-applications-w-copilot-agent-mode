import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const navItems = [
  { to: '/activities', label: 'Activities' },
  { to: '/users', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/workouts', label: 'Workouts' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

function App() {
  const baseApiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
    : 'http://localhost:8000';

  return (
    <div className="app-shell container py-4 py-md-5">
      <header className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
            <div className="d-flex align-items-start gap-3">
              <img
                src={`${process.env.PUBLIC_URL}/octofitapp-small.svg`}
                alt="OctoFit"
                width="58"
                height="58"
                className="app-logo"
              />
              <div>
                <h1 className="display-5 fw-semibold mb-2 app-title">OctoFit Tracker</h1>
                <p className="lead app-subtitle mb-0">
                Track activities, teams, workouts, and leaderboard progress from one dashboard.
                </p>
              </div>
            </div>
            <a href={`${baseApiUrl}/api/`} className="btn btn-outline-primary" target="_blank" rel="noreferrer">
              Open API Root
            </a>
          </div>
        </div>
      </header>

      <nav className="card border-0 shadow-sm mb-4" aria-label="Main navigation">
        <div className="card-body py-3">
          <ul className="nav nav-pills app-nav gap-2">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link rounded-pill px-3 ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/activities" replace />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
