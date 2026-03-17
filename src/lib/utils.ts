export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateAnimalId(species: string, year: number, seq: number): string {
  const prefix = species.toUpperCase().slice(0, 3);
  return `${prefix}-${year}-${seq.toString().padStart(4, '0')}`;
}

export function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'donor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'volunteer': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'adopter': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

// Generate a contextual insight based on a move
export function getMoveInsight(move: { fromRoles: string[]; toRoles: string[]; trigger?: string }): { text: string; sentiment: 'positive' | 'neutral' | 'negative' } {
  const added = move.toRoles.filter(r => !move.fromRoles.includes(r));
  const removed = move.fromRoles.filter(r => !move.toRoles.includes(r));

  if (move.fromRoles.length === 0) {
    // Initial engagement
    const role = move.toRoles[0];
    if (role === 'donor') return { text: 'Entered the community as a donor', sentiment: 'positive' };
    if (role === 'volunteer') return { text: 'Entered the community as a volunteer', sentiment: 'positive' };
    if (role === 'adopter') return { text: 'Entered the community as an adopter', sentiment: 'positive' };
    return { text: 'Joined the community', sentiment: 'positive' };
  }

  if (added.length > 0 && removed.length === 0) {
    // Deepening engagement
    if (added.includes('volunteer') && move.fromRoles.includes('donor')) {
      return { text: 'Deepening engagement — donor now also volunteering time', sentiment: 'positive' };
    }
    if (added.includes('donor') && move.fromRoles.includes('volunteer')) {
      return { text: 'Deepening engagement — volunteer now also contributing financially', sentiment: 'positive' };
    }
    if (added.includes('adopter')) {
      return { text: 'Major milestone — became an adopter, directly changing an animal\'s life', sentiment: 'positive' };
    }
    return { text: `Expanded involvement — added ${added.join(', ')} role${added.length > 1 ? 's' : ''}`, sentiment: 'positive' };
  }

  if (removed.length > 0 && added.length === 0) {
    // Reduced engagement
    if (removed.includes('donor') && move.toRoles.includes('volunteer')) {
      return { text: 'Shifted from financial to hands-on support', sentiment: 'neutral' };
    }
    if (removed.includes('volunteer') && move.toRoles.includes('donor')) {
      return { text: 'Stepped back from volunteering, continuing as donor', sentiment: 'neutral' };
    }
    return { text: `${removed.join(', ')} role${removed.length > 1 ? 's' : ''} lapsed — may be a re-engagement opportunity`, sentiment: 'negative' };
  }

  return { text: 'Role changed', sentiment: 'neutral' };
}

export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'adopted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'foster': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'medical-hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'intake': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case 'transferred': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'deceased': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'euthanized': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

export function getDonationTypeColor(type: string): string {
  switch (type) {
    case 'monetary': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    case 'in-kind': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    case 'time': return 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}
