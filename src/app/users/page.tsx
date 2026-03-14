'use client';

import { useState } from 'react';
import {
  Users,
  Plus,
  Shield,
  ShieldCheck,
  Mail,
  ToggleLeft,
  ToggleRight,
  UserCog,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { DataTable, Column } from '@/components/ui/DataTable';
import { useAuth } from '@/context/AuthContext';
import { getUsers } from '@/lib/tenant-data';
import { formatDate, generateId } from '@/lib/utils';
import type { User, UserRole } from '@/lib/types';

export default function UsersPage() {
  const { currentTenant, isAdmin } = useAuth();
  const tenantId = currentTenant?.id ?? '';

  const [users, setUsers] = useState<User[]>(() => getUsers(tenantId));
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Form state for new user
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('staff');

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      !search ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(u => u.role === 'admin').length;
  const staffCount = users.filter(u => u.role === 'staff').length;
  const activeCount = users.filter(u => u.isActive).length;

  const toggleActive = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const changeRole = (userId: string, role: UserRole) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role } : u))
    );
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: generateId('user'),
      tenantId,
      email: newEmail,
      firstName: newFirstName,
      lastName: newLastName,
      role: newRole,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
    setShowAddModal(false);
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewRole('staff');
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (u) => (
        <div>
          <p className="font-medium">{u.firstName} {u.lastName}</p>
          <p className="text-xs text-muted">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <Badge className={u.role === 'admin'
          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        }>
          {u.role === 'admin' ? <ShieldCheck className="w-3 h-3 mr-1 inline" /> : <Shield className="w-3 h-3 mr-1 inline" />}
          {u.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => (
        <Badge className={u.isActive
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }>
          {u.isActive ? 'Active' : 'Disabled'}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      className: 'hidden sm:table-cell',
      render: (u) => (
        <span className="text-sm text-muted">
          {u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Never'}
        </span>
      ),
    },
    {
      key: 'created',
      header: 'Created',
      className: 'hidden md:table-cell',
      render: (u) => (
        <span className="text-sm text-muted">{formatDate(u.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (u) => (
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <select
                value={u.role}
                onChange={(e) => changeRole(u.id, e.target.value as UserRole)}
                className="text-xs border border-border rounded px-1.5 py-1 bg-surface"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={() => toggleActive(u.id)}
                className={`shrink-0 ${u.isActive ? 'text-success' : 'text-muted'}`}
                title={u.isActive ? 'Active — click to disable' : 'Disabled — click to enable'}
              >
                {u.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Card>
          <CardBody>
            <div className="text-center py-12 text-muted">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Admin Access Required</p>
              <p className="text-sm mt-1">Only administrators can manage users.</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted text-sm mt-1">
            Manage users for {currentTenant?.name ?? 'your organization'}
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />Invite User
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{adminCount}</p>
              <p className="text-xs text-muted">Admins</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{staffCount}</p>
              <p className="text-xs text-muted">Staff</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-xs text-muted">Active</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64"
        />
        <div className="flex gap-2">
          {['all', 'admin', 'staff'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                roleFilter === r
                  ? 'bg-primary text-white'
                  : 'bg-surface-hover text-muted hover:text-foreground'
              }`}
            >
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      <DataTable columns={columns} data={filteredUsers} keyExtractor={(u) => u.id} />

      {/* Add User Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Invite New User" size="sm">
        <form className="space-y-4" onSubmit={handleAddUser}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" required>
              <Input
                value={newFirstName}
                onChange={e => setNewFirstName(e.target.value)}
                placeholder="First name"
                required
              />
            </FormField>
            <FormField label="Last Name" required>
              <Input
                value={newLastName}
                onChange={e => setNewLastName(e.target.value)}
                placeholder="Last name"
                required
              />
            </FormField>
          </div>
          <FormField label="Email" required>
            <Input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="user@organization.org"
              required
            />
          </FormField>
          <FormField label="Role" required>
            <Select value={newRole} onChange={e => setNewRole(e.target.value as UserRole)}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </Select>
          </FormField>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-300">
                When authentication is enabled, an invitation email will be sent to the user with instructions to set up their account.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
