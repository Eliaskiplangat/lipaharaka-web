import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconDashboard, IconInvoice, IconAdvance, IconBusiness, IconAdmin, IconLogout, IconSettings } from './icons'

const smeNavItems = [
  { to: '/', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/invoices', label: 'Invoices', icon: IconInvoice },
  { to: '/advances', label: 'Cash advances', icon: IconAdvance },
  { to: '/business', label: 'Business', icon: IconBusiness },
]

const adminNavItems = [
  { to: '/admin', label: 'Overview', icon: IconDashboard, end: true },
  { to: '/admin/kyc', label: 'KYC review', icon: IconAdmin },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navItems = user?.role === 'ADMIN' ? adminNavItems : smeNavItems

  return (
    <div className="min-h-screen flex flex-col bg-paper md:flex-row">
      <header className="md:hidden flex items-center justify-between border-b border-line bg-ink-900 px-4 py-3 text-white shadow-sm">
        <button onClick={() => setDrawerOpen(true)} aria-label="Open menu" className="rounded p-1.5 text-white">
          <span className="mb-1 block h-0.5 w-5 bg-white" />
          <span className="mb-1 block h-0.5 w-5 bg-white" />
          <span className="block h-0.5 w-5 bg-white" />
        </button>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#3d4046] px-3 py-1.5 shadow-sm ring-1 ring-white/10">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAFEF7] text-[10px] font-bold tracking-[-0.08em] text-[#0A554C]">
            LP
          </div>
          <span className="text-base font-semibold tracking-tight text-white">LipaHaraka</span>
          <span className="text-xl leading-none text-white/80">+</span>
        </div>

        <span className="w-7" />
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-charcoal/50 md:hidden" onClick={() => setDrawerOpen(false)}>
          <nav
            className="h-full w-72 bg-ink-900 p-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent navItems={navItems} user={user} logout={logout} onNavigate={() => setDrawerOpen(false)} />
          </nav>
        </div>
      )}

      <nav className="hidden w-64 shrink-0 bg-ink-900 p-5 text-white md:flex md:flex-col">
        <SidebarContent navItems={navItems} user={user} logout={logout} />
      </nav>

      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function SidebarContent({ navItems, user, logout, onNavigate }) {
  return (
    <>
      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-3 shadow-sm">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-100">Account</p>
        <p className="mt-2 text-sm font-semibold text-white">{user?.fullName || 'Business owner'}</p>
        <p className="mt-1 text-xs text-ink-100">
          {user?.role === 'ADMIN' ? 'Platform admin' : 'Business owner'}
        </p>
      </div>

      <ul className="flex-1 space-y-1.5">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? 'border-ink-300 bg-ink-700 text-white shadow-sm'
                    : 'border-transparent text-ink-100 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-white/10 pt-4 space-y-2">
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive ? 'bg-white/10 text-white font-medium' : 'text-ink-100 hover:bg-white/5 hover:text-white'}`}
        >
          <IconSettings />
          Settings
        </NavLink>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-100 transition-colors hover:bg-white/5 hover:text-white"
        >
          <IconLogout />
          Log out
        </button>
      </div>
    </>
  )
}
