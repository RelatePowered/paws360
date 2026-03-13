'use client';

import { useState } from 'react';
import {
  Settings,
  Plus,
  Tag,
  Shield,
  AlertTriangle,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Edit3,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { mockTags, mockAlertRules } from '@/lib/mock-data';
import { formatDate, getSeverityColor } from '@/lib/utils';
import type { AdminTag, AlertRule } from '@/lib/types';

export default function AdminPage() {
  const [tab, setTab] = useState<'tags' | 'rules'>('tags');
  const [tagCategory, setTagCategory] = useState<string>('all');
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [tags, setTags] = useState<AdminTag[]>(mockTags);
  const [rules, setRules] = useState<AlertRule[]>(mockAlertRules);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="text-muted text-sm mt-1">Manage tags, alerts, and system settings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-hover rounded-lg w-fit">
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
