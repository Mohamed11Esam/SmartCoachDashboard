import api from '../../lib/axios';
import type { CoachProfile } from '../../types';

export async function getCoachProfiles(): Promise<CoachProfile[]> {
  const res = await api.get<CoachProfile[]>('/coach-profile');
  return res.data;
}

export async function verifyCoach(
  id: string,
  isVerified: boolean
): Promise<CoachProfile> {
  const res = await api.put<CoachProfile>(`/coach-profile/${id}/verify`, {
    isVerified,
  });
  return res.data;
}
