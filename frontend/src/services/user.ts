import { User, TrustedContact, DoctorAccess, Session } from '../types';
import { getAllUsersData, saveAllUsersData, mockHashPassword } from './auth';

export function getUserById(userId: string): User | null {
  const all = getAllUsersData();
  return all[userId]?.user || null;
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const all = getAllUsersData();
  if (!all[userId]) return null;

  all[userId].user = {
    ...all[userId].user,
    ...updates
  };
  saveAllUsersData(all);
  return all[userId].user;
}

export function changeUserPassword(userId: string, currentPw: string, newPw: string): { success: boolean; error?: string } {
  const all = getAllUsersData();
  if (!all[userId]) return { success: false, error: 'User not found' };

  if (all[userId].passwordHash !== mockHashPassword(currentPw)) {
    return { success: false, error: 'Current password did not match.' };
  }

  all[userId].passwordHash = mockHashPassword(newPw);
  saveAllUsersData(all);
  return { success: true };
}

// Trusted contacts management
export function addTrustedContact(userId: string, contact: Omit<TrustedContact, 'id'>): User | null {
  const user = getUserById(userId);
  if (!user) return null;

  const newContact: TrustedContact = {
    ...contact,
    id: `tc-${Date.now()}`
  };

  const updatedContacts = [...user.trustedContacts, newContact];
  return updateUser(userId, { trustedContacts: updatedContacts });
}

export function removeTrustedContact(userId: string, contactId: string): User | null {
  const user = getUserById(userId);
  if (!user) return null;
  const filtered = user.trustedContacts.filter((c) => c.id !== contactId);
  return updateUser(userId, { trustedContacts: filtered });
}

// Doctor sharing control
export function updateDoctorAccess(userId: string, doctorAccess: DoctorAccess): User | null {
  const user = getUserById(userId);
  if (!user) return null;

  const existingIndex = user.doctorAccessList.findIndex((d) => d.doctorId === doctorAccess.doctorId);
  let updatedList = [...user.doctorAccessList];

  if (existingIndex >= 0) {
    updatedList[existingIndex] = doctorAccess;
  } else {
    updatedList.push(doctorAccess);
  }

  return updateUser(userId, { doctorAccessList: updatedList });
}

// Sessions management
export function revokeSession(userId: string, sessionId: string): User | null {
  const user = getUserById(userId);
  if (!user) return null;
  const filtered = user.sessions.filter((s) => s.id !== sessionId);
  return updateUser(userId, { sessions: filtered });
}

export function revokeAllOtherSessions(userId: string): User | null {
  const user = getUserById(userId);
  if (!user) return null;
  const kept = user.sessions.filter((s) => s.isCurrent);
  return updateUser(userId, { sessions: kept });
}

// Account actions: Pause
export function pauseAccount(userId: string): User | null {
  return updateUser(userId, { status: 'paused' });
}

export function unpauseAccount(userId: string): User | null {
  return updateUser(userId, { status: 'active' });
}

// Account actions: Delete with 7-day grace period
export function requestAccountDeletion(userId: string, reason?: string): User | null {
  const deletionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  return updateUser(userId, {
    status: 'pending_deletion',
    deletionRequestedAt: deletionDate
  });
}

export function cancelAccountDeletion(userId: string): User | null {
  return updateUser(userId, {
    status: 'active',
    deletionRequestedAt: undefined
  });
}

// Export user data
export function exportUserData(user: User): { jsonString: string; printableHtml: string } {
  const sanitized = {
    profile: {
      nickname: user.nickname,
      name: user.name,
      email: user.email,
      phone: user.phone,
      memberSince: user.createdAt,
      plan: user.plan,
      streakDays: user.streakDays,
      points: user.points
    },
    recoveryPreferences: user.preferences,
    healthBasics: user.healthBasics,
    consents: user.consents,
    trustedContacts: user.trustedContacts
  };

  const jsonString = JSON.stringify(sanitized, null, 2);

  const printableHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pathway Personal Summary - ${user.nickname}</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; color: #333; line-height: 1.6; }
          h1 { color: #1d4ed8; }
          h2 { border-bottom: 1px solid #ddd; padding-bottom: 0.5rem; margin-top: 1.5rem; }
          .badge { display: inline-block; padding: 4px 8px; background: #dbeafe; color: #1e40af; border-radius: 4px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #eee; }
        </style>
      </head>
      <body>
        <h1>Pathway Personal Record</h1>
        <p>Personal archive generated on ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
        <p><span class="badge">Member: ${user.nickname}</span> &bull; Plan: ${user.plan} &bull; Streak: ${user.streakDays} days</p>

        <h2>Recovery Focus</h2>
        <p><strong>Areas:</strong> ${user.preferences.helpWith.join(', ') || 'None recorded'}</p>
        <p><strong>Goals:</strong> ${user.preferences.goals.join(', ') || 'None'}</p>
        <p><strong>Known Triggers:</strong> ${user.preferences.triggers.join(', ') || 'None'}</p>

        <h2>Health Notes (Private)</h2>
        <p><strong>Allergies:</strong> ${user.healthBasics.allergies || 'None declared'}</p>
        <p><strong>Medicines:</strong> ${user.healthBasics.currentMedicines || 'None'}</p>
        <p><strong>Care Notes:</strong> ${user.healthBasics.pastCareNotes || 'None'}</p>

        <h2>Trusted Emergency Contacts</h2>
        ${user.trustedContacts.length > 0 ? `
          <ul>
            ${user.trustedContacts.map((c) => `<li>${c.name} (${c.relationship}): ${c.phone}</li>`).join('')}
          </ul>
        ` : '<p>No trusted contacts added.</p>'}

        <hr style="margin-top: 2rem;" />
        <p style="font-size: 12px; color: #777;">Pathway supports your recovery. It does not replace medical advice or emergency services.</p>
      </body>
    </html>
  `;

  return { jsonString, printableHtml };
}
