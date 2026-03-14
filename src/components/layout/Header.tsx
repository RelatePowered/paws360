'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Sun, Moon, Bell, ChevronDown, LogOut, Building2, Shield } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { mockUsers } from '@/lib/mock-data';

interface HeaderProps {
  onMenuClick: () => void;
}

function roleBadge(role: string) {
  switch (role) {
    case 'super_admin': return 'Super Admin';
    case 'admin': return 'Admin';
    default: return 'Staff';
  }
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const {
    currentUser,
    currentTenant,
    tenants,
    isSuperAdmin,
    switchTenant,
    switchUser,
    logout,
  } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const demoMode = !isSupabaseConfigured();

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : '?';

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-hover text-muted"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Tenant name / switcher */}
          {currentTenant && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium text-muted">
                {currentTenant.name}
              </span>
              {isSuperAdmin && tenants.length > 1 && (
                <select
                  value={currentTenant.id}
                  onChange={e => switchTenant(e.target.value)}
                  className="text-xs border border-border rounded px-1.5 py-0.5 bg-surface text-muted"
                  title="Switch tenant"
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-surface-hover text-muted">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-surface-hover text-muted"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* User dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(prev => !prev)}
              className="flex items-center gap-2 ml-1 p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-tight">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Not logged in'}
                </p>
                <p className="text-xs text-muted leading-tight">
                  {currentUser ? roleBadge(currentUser.role) : ''}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-surface border border-border rounded-lg shadow-lg z-50">
                {/* User info */}
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-sm">
                    {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''}
                  </p>
                  <p className="text-xs text-muted">{currentUser?.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="w-3 h-3 text-muted" />
                    <span className="text-xs text-muted">{currentUser ? roleBadge(currentUser.role) : ''}</span>
                    {isSuperAdmin && (
                      <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-1.5 py-0.5 rounded ml-1">
                        Cross-tenant
                      </span>
                    )}
                  </div>
                </div>

                {/* Super admin: tenant switcher (mobile) */}
                {isSuperAdmin && tenants.length > 1 && (
                  <div className="p-2 border-b border-border sm:hidden">
                    <p className="text-xs text-muted uppercase tracking-wider px-1 mb-1">Tenant</p>
                    {tenants.map(t => (
                      <button
                        key={t.id}
                        onClick={() => { switchTenant(t.id); setShowUserMenu(false); }}
                        className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center gap-2 ${
                          currentTenant?.id === t.id ? 'bg-primary/10 text-primary' : 'hover:bg-surface-hover'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Demo mode: user switcher */}
                {demoMode && (
                  <div className="p-1 border-b border-border">
                    <p className="text-xs text-muted uppercase tracking-wider px-2 py-1">Switch User (Demo)</p>
                    {mockUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => { switchUser(u.id); setShowUserMenu(false); }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-surface-hover transition-colors flex items-center justify-between ${
                          currentUser?.id === u.id ? 'bg-primary/10 text-primary' : ''
                        }`}
                      >
                        <div>
                          <p className="font-medium">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-muted">{u.role} &middot; {u.email}</p>
                        </div>
                        {currentUser?.id === u.id && (
                          <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">Current</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Sign out */}
                <div className="p-1">
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-surface-hover text-danger flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
