'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Plus,
  Tag,
  Shield,
  ShieldCheck,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Users,
  UserCog,
  Mail,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { DataTable, Column } from '@/components/ui/DataTable';
import { useAuth } from '@/context/AuthContext';
import { useUsers, useTags, useAlertRules, mockTags, mockAlertRules, mockUsers } from '@/hooks/useTenantData';
import { formatDate, generateId, getSeverityColor } from '@/lib/utils';
import type { AdminTag, AlertRule, User, UserRole } from '@/lib/types';

type AdminTab = 'users' | 'tags' | 'rules';

export default function AdminPage() {
  const { currentTenant, isAdmin } = useAuth();
  const tenantId = currentTenant?.id ?? '';

  const [tab, setTab] = useState<AdminTab>('users');

  // ── Hooks for Supabase-backed data (falls back to mock) ──
  const fetchedUsers = useUsers(mockUsers.filter(u => u.tenantId === tenantId));
  const fetchedTags = useTags(mockTags.filter(t => t.tenantId === tenantId));
  const fetchedRules = useAlertRules(mockAlertRules.filter(r => r.tenantId === tenantId));

  // ── Tags state ──
  const [tagCategory, setTagCategory] = useState<string>('all');
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [tags, setTags] = useState<AdminTag[]>(fetchedTags);

  // ── Rules state ──
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [rules, setRules] = useState<AlertRule[]>(fetchedRules);

  // ── Users state ──
  const [users, setUsers] = useState<User[]>(fetchedUsers);

  // Sync hook results into local state when Supabase data arrives
  useEffect(() => { setUsers(fetchedUsers); }, [fetchedUsers]);
  useEffect(() => { setTags(fetchedTags); }, [fetchedTags]);
  useEffect(() => { setRules(fetchedRules); }, [fetchedRules]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('staff');

  // ── Tags logic ──
  const filteredTags = tags.filter(t => tagCategory === 'all' || t.category === tagCategory);
  const tagsByCategory = {
    person: tags.filter(t => t.category === 'person'),
    animal: tags.filter(t => t.category === 'animal'),
    adopter: tags.filter(t => t.category === 'adopter'),
    donation: tags.filter(t => t.category === 'donation'),
    alert: tags.filter(t => t.category === 'alert'),
  };
  const toggleTag = (id: string) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };
  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  // ── Users logic ──
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      !userSearch ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });
  const adminCount = users.filter(u => u.role === 'admin').length;
  const staffCount = users.filter(u => u.role === 'staff').length;
  const activeCount = users.filter(u => u.isActive).length;

  const toggleUserActive = (userId: string) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, isActive: !u.isActive } : u)));
  };
  const changeUserRole = (userId: string, role: UserRole) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role } : u)));
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
    setShowAddUserModal(false);
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewRole('staff');
  };

  const userColumns: Column<User>[] = [
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
                onChange={(e) => changeUserRole(u.id, e.target.value as UserRole)}
                className="text-xs border border-border rounded px-1.5 py-1 bg-surface"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={() => toggleUserActive(u.id)}
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
        <h1 className="text-2xl font-bold">Administration</h1>
        <Card>
          <CardBody>
            <div className="text-center py-12 text-muted">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Admin Access Required</p>
              <p className="text-sm mt-1">Only administrators can access this page.</p>
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
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="text-muted text-sm mt-1">
            Manage users, tags, and alert rules for {currentTenant?.name ?? 'your organization'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-hover rounded-lg w-fit">
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            tab === 'users' ? 'bg-surface shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />Users ({users.length})
        </button>
        <button
          onClick={() => setTab('tags')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            tab === 'tags' ? 'bg-surface shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          <Tag className="w-4 h-4" />Tags ({tags.length})
        </button>
        <button
          onClick={() => setTab('rules')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            tab === 'rules' ? 'bg-surface shadow-sm' : 'text-muted hover:text-foreground'
          }`}
        >
          <Shield className="w-4 h-4" />Alert Rules ({rules.length})
        </button>
      </div>

      {/* ════════════ Users Tab ════════════ */}
      {tab === 'users' && (
        <>
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

          {/* Filters + Add button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="sm:w-64"
              />
              <div className="flex gap-2">
                {['all', 'admin', 'staff'].map(r => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      userRoleFilter === r
                        ? 'bg-primary text-white'
                        : 'bg-surface-hover text-muted hover:text-foreground'
                    }`}
                  >
                    {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <Button size="sm" onClick={() => setShowAddUserModal(true)}>
              <Plus className="w-4 h-4" />Invite User
            </Button>
          </div>

          <DataTable columns={userColumns} data={filteredUsers} keyExtractor={(u) => u.id} />
        </>
      )}

      {/* ════════════ Tags Tab ════════════ */}
      {tab === 'tags' && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {['all', 'person', 'animal', 'adopter', 'donation', 'alert'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setTagCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    tagCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-surface-hover text-muted hover:text-foreground'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  {cat !== 'all' && ` (${tagsByCategory[cat as keyof typeof tagsByCategory].length})`}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={() => setShowAddTagModal(true)}>
              <Plus className="w-4 h-4" />Add Tag
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTags.map(tag => (
              <Card key={tag.id}>
                <CardBody className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{tag.label}</p>
                        {tag.severity && (
                          <Badge className={getSeverityColor(tag.severity)}>{tag.severity}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted capitalize">{tag.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleTag(tag.id)}
                    className={`shrink-0 ${tag.isActive ? 'text-success' : 'text-muted'}`}
                    title={tag.isActive ? 'Active - click to disable' : 'Disabled - click to enable'}
                  >
                    {tag.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ════════════ Rules Tab ════════════ */}
      {tab === 'rules' && (
        <>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowAddRuleModal(true)}>
              <Plus className="w-4 h-4" />Add Rule
            </Button>
          </div>

          <div className="space-y-3">
            {rules.map(rule => (
              <Card key={rule.id}>
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        rule.severity === 'critical' ? 'bg-danger/10 text-danger' :
                        rule.severity === 'warning' ? 'bg-warning/10 text-warning' :
                        'bg-info/10 text-info'
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{rule.name}</h3>
                          <Badge className={getSeverityColor(rule.severity)}>{rule.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted mt-1">{rule.description}</p>
                        <p className="text-xs text-muted mt-1">
                          Condition: <span className="font-mono">{rule.condition}</span> &ge; {rule.threshold}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`shrink-0 ${rule.isActive ? 'text-success' : 'text-muted'}`}
                    >
                      {rule.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ════════════ Modals ════════════ */}

      {/* Add User Modal */}
      <Modal open={showAddUserModal} onClose={() => setShowAddUserModal(false)} title="Invite New User" size="sm">
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
            <Button variant="outline" type="button" onClick={() => setShowAddUserModal(false)}>Cancel</Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </Modal>

      {/* Add Tag Modal */}
      <Modal open={showAddTagModal} onClose={() => setShowAddTagModal(false)} title="Add Tag" size="sm">
        <form className="space-y-4" onSubmit={e => {
          e.preventDefault();
          setShowAddTagModal(false);
        }}>
          <FormField label="Tag Label" required>
            <Input placeholder="e.g., Excellent Adopter" required />
          </FormField>
          <FormField label="Category" required>
            <Select required>
              <option value="">Select category</option>
              <option value="person">Person</option>
              <option value="animal">Animal</option>
              <option value="adopter">Adopter</option>
              <option value="donation">Donation</option>
              <option value="alert">Alert</option>
            </Select>
          </FormField>
          <FormField label="Severity (for adopter/alert tags)">
            <Select>
              <option value="">No severity</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </Select>
          </FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowAddTagModal(false)}>Cancel</Button>
            <Button type="submit">Add Tag</Button>
          </div>
        </form>
      </Modal>

      {/* Add Rule Modal */}
      <Modal open={showAddRuleModal} onClose={() => setShowAddRuleModal(false)} title="Add Alert Rule" size="md">
        <form className="space-y-4" onSubmit={e => {
          e.preventDefault();
          setShowAddRuleModal(false);
        }}>
          <FormField label="Rule Name" required>
            <Input placeholder="e.g., Repeat Returner Alert" required />
          </FormField>
          <FormField label="Description" required>
            <Input placeholder="Describe what triggers this alert" required />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Condition" required>
              <Select required>
                <option value="">Select condition</option>
                <option value="return_count_gte">Return count &ge; threshold</option>
                <option value="note_severity">Note severity match</option>
                <option value="custom">Custom condition</option>
              </Select>
            </FormField>
            <FormField label="Threshold" required>
              <Input type="number" min="1" placeholder="e.g., 2" required />
            </FormField>
          </div>
          <FormField label="Severity" required>
            <Select required>
              <option value="">Select severity</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </Select>
          </FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowAddRuleModal(false)}>Cancel</Button>
            <Button type="submit">Add Rule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
