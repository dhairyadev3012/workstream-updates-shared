import type { SwatchKey } from "./swatches";

export interface StatusRecord {
  id: string;
  label: string;
  colorKey: SwatchKey;
  isDefault: boolean;
  needsAttention: boolean;
  sortOrder: number;
}

export interface AppSettings {
  dashboardTitle: string;
  timezone: string;
  staleAfterDays: number;
}

export interface UpdateRecord {
  id: string;
  workstreamId: string;
  updateDate: string; // YYYY-MM-DD
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkstreamWithUpdates {
  id: string;
  sectionId: string;
  name: string;
  statusId: string | null;
  status: StatusRecord | null;
  sortOrder: number;
  isArchived: boolean;
  needsAttentionOverride: boolean;
  updates: UpdateRecord[]; // newest first
}

export interface SectionWithWorkstreams {
  id: string;
  trackId: string;
  name: string;
  sortOrder: number;
  isArchived: boolean;
  workstreams: WorkstreamWithUpdates[];
}

export interface TrackWithSections {
  id: string;
  name: string;
  sortOrder: number;
  isArchived: boolean;
  sections: SectionWithWorkstreams[];
}

export interface DashboardData {
  tracks: TrackWithSections[];
  statuses: StatusRecord[];
  settings: AppSettings;
}
