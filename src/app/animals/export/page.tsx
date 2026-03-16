'use client';

import { useState } from 'react';
import {
  Download,
  Globe,
  CheckCircle2,
  Copy,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAnimals, mockAnimals } from '@/hooks/useTenantData';
import { useAuth } from '@/context/AuthContext';
import type { Animal } from '@/lib/types';

/** Map internal species to Petfinder species values. */
function petfinderSpecies(species: string): string {
  switch (species) {
    case 'dog': return 'Dog';
    case 'cat': return 'Cat';
    case 'bird': return 'Bird';
    case 'rabbit': return 'Rabbit';
    default: return 'Barnyard';
  }
}

function petfinderSize(size: string): string {
  switch (size) {
    case 'small': return 'S';
    case 'medium': return 'M';
    case 'large': return 'L';
    case 'extra-large': return 'XL';
    default: return 'M';
  }
}

function petfinderGender(gender: string): string {
  switch (gender) {
    case 'male': return 'M';
    case 'female': return 'F';
    default: return 'U';
  }
}

function petfinderAltered(status: string): string {
  switch (status) {
    case 'spayed': return 'Yes';
    case 'neutered': return 'Yes';
    default: return 'No';
  }
}

/**
 * Generate a Petfinder-compatible CSV.
 * Follows the Petfinder Import Tool column specification.
 */
function generatePetfinderCsv(animals: Animal[], shelterName: string): string {
  const headers = [
    'ID', 'Internal', 'AnimalName', 'PrimaryBreed', 'SecondaryBreed',
    'Sex', 'Size', 'Age', 'Desc', 'Type', 'Status',
    'Shots', 'Altered', 'NoDogs', 'NoCats', 'NoKids',
    'Housetrained', 'Declawed', 'specialNeeds', 'Mix', 'Color',
  ];

  const rows = animals.map(a => {
    const hasSpecialNeeds = a.tags.includes('Special Needs') ? 'Yes' : '';
    const goodWithKids = a.tags.includes('Good with Kids');
    return [
      a.animalId,             // ID
      a.id,                   // Internal
      a.name,                 // AnimalName
      a.breed,                // PrimaryBreed
      '',                     // SecondaryBreed
      petfinderGender(a.gender),
      petfinderSize(a.size),
      a.age || 'Adult',       // Age
      `"${a.description.replace(/"/g, '""')}"`, // Desc (quoted for CSV safety)
      petfinderSpecies(a.species),
      'A',                    // Status: A = Adoptable
      'Yes',                  // Shots (assume up to date for available animals)
      petfinderAltered(a.alteredStatus),
      '',                     // NoDogs
      '',                     // NoCats
      goodWithKids ? '' : '', // NoKids
      '',                     // Housetrained
      '',                     // Declawed
      hasSpecialNeeds,        // specialNeeds
      a.breed.includes('Mix') ? 'Yes' : '', // Mix
      a.color,                // Color
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Generate an Adopt-a-Pet compatible CSV.
 * Follows the Adopt-a-Pet bulk upload specification.
 */
function generateAdoptAPetCsv(animals: Animal[], shelterName: string): string {
  const headers = [
    'Id', 'Pet Name', 'Species', 'Primary Breed', 'Secondary Breed',
    'Sex', 'Size', 'Age', 'Color', 'Description',
    'Status', 'Spayed/Neutered', 'Special Needs',
  ];

  const rows = animals.map(a => [
    a.animalId,
    a.name,
    petfinderSpecies(a.species),
    a.breed,
    '',
    a.gender === 'male' ? 'Male' : a.gender === 'female' ? 'Female' : 'Unknown',
    a.size.charAt(0).toUpperCase() + a.size.slice(1),
    a.age || 'Adult',
    a.color,
    `"${a.description.replace(/"/g, '""')}"`,
    'Available',
    a.alteredStatus === 'spayed' || a.alteredStatus === 'neutered' ? 'Yes' : 'No',
    a.tags.includes('Special Needs') ? 'Yes' : 'No',
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AnimalExportPage() {
  const allAnimals = useAnimals(mockAnimals);
  const { currentTenant } = useAuth();
  const shelterName = currentTenant?.name ?? 'Our Shelter';

  const exportableAnimals = allAnimals.filter(a => a.status === 'available');
  const [copiedApi, setCopiedApi] = useState(false);

  const handlePetfinderExport = () => {
    const csv = generatePetfinderCsv(exportableAnimals, shelterName);
    downloadCsv(csv, `petfinder-export-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleAdoptAPetExport = () => {
    const csv = generateAdoptAPetCsv(exportableAnimals, shelterName);
    downloadCsv(csv, `adopt-a-pet-export-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleCopyApiEndpoint = () => {
    navigator.clipboard.writeText(`${window.location.origin}/api/animals/available`);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Publish Animals</h1>
        <p className="text-muted text-sm mt-1">Export available animals to adoption listing portals</p>
      </div>

      {/* Summary */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium">{exportableAnimals.length} animals ready to publish</h3>
                <p className="text-sm text-muted">Only animals with status &quot;available&quot; are included in exports</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Export Targets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Petfinder */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">Pf</span>
              </div>
              <div>
                <h3 className="font-semibold">Petfinder</h3>
                <p className="text-xs text-muted">CSV format for Petfinder Import Tool</p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Generates a CSV compatible with Petfinder&apos;s bulk import tool. Includes breed, size,
                age, gender, altered status, description, and special needs flags.
              </p>
              <div className="text-sm space-y-1">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Petfinder Import Tool format
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Auto-maps species, size, gender codes
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Includes animal ID for tracking
                </p>
              </div>
              <Button onClick={handlePetfinderExport} className="w-full">
                <Download className="w-4 h-4" />
                Download Petfinder CSV ({exportableAnimals.length} animals)
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Adopt-a-Pet */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">Aa</span>
              </div>
              <div>
                <h3 className="font-semibold">Adopt-a-Pet</h3>
                <p className="text-xs text-muted">CSV format for Adopt-a-Pet bulk upload</p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Generates a CSV compatible with Adopt-a-Pet&apos;s bulk upload system. Maps your animal
                data to their required format automatically.
              </p>
              <div className="text-sm space-y-1">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Adopt-a-Pet bulk upload format
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Includes spay/neuter status
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Special needs flagged automatically
                </p>
              </div>
              <Button onClick={handleAdoptAPetExport} className="w-full">
                <Download className="w-4 h-4" />
                Download Adopt-a-Pet CSV ({exportableAnimals.length} animals)
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* API Endpoint */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted" />
            <h3 className="font-semibold">API / Widget Embed</h3>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted mb-3">
            Use this endpoint to display available animals on your organization&apos;s website or
            build a custom adoption widget.
          </p>
          <div className="flex gap-2">
            <code className="flex-1 p-3 rounded-lg bg-surface-hover text-sm font-mono truncate">
              {typeof window !== 'undefined' ? window.location.origin : ''}/api/animals/available
            </code>
            <Button variant="outline" onClick={handleCopyApiEndpoint}>
              {copiedApi ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copiedApi ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Preview of Exportable Animals */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Animals Included in Export</h3>
        </CardHeader>
        <CardBody>
          {exportableAnimals.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">No animals currently available for export</p>
          ) : (
            <div className="space-y-3">
              {exportableAnimals.map(animal => (
                <div key={animal.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{animal.name}</p>
                      <p className="text-xs text-muted font-mono">{animal.animalId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <p className="capitalize">{animal.species} &middot; {animal.breed}</p>
                      <p className="text-xs text-muted capitalize">{animal.gender} &middot; {animal.size} &middot; {animal.age || 'Unknown age'}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {animal.alteredStatus === 'spayed' || animal.alteredStatus === 'neutered' ? 'Altered' : 'Intact'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
