import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router'

const NAV = [
  { to: '/topics', label: 'Topics' },
  { to: '/playground', label: 'Playground' },
  { to: '/reference', label: 'Reference' },
]

export function Layout() {
  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link className="wordmark" to="/">
            Under the Harness
          </Link>
          <nav className="mode-switch" aria-label="Sections">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'on' : '')}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
