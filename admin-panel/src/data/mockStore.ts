import {
  ActivityCategory,
  ActivityLogItem,
  ManagedAppointment,
  ManagedDoctor,
  ManagedUser,
  PlatformSettings,
} from '@/types/admin';
import {
  INITIAL_ACTIVITY_LOGS,
  INITIAL_APPOINTMENTS,
  INITIAL_DOCTORS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
} from '@/data/mockPlatformData';

class PlatformMockStore {
  users: ManagedUser[] = structuredClone(INITIAL_USERS);
  doctors: ManagedDoctor[] = structuredClone(INITIAL_DOCTORS);
  appointments: ManagedAppointment[] = structuredClone(INITIAL_APPOINTMENTS);
  activities: ActivityLogItem[] = structuredClone(INITIAL_ACTIVITY_LOGS);
  settings: PlatformSettings = structuredClone(INITIAL_SETTINGS);

  addActivity(entry: {
    category: ActivityCategory;
    actorName: string;
    actorRole: string;
    action: string;
    target: string;
    details: string;
  }) {
    const item: ActivityLogItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...entry,
      timestamp: new Date().toISOString(),
      source: 'mock',
    };
    this.activities = [item, ...this.activities];
    return item;
  }
}

export const mockStore = new PlatformMockStore();
