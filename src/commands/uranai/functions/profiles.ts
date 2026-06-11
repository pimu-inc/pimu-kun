import type { Profile } from '../types';

type ProfileRow = {
  id: string;
  name: string;
  birthday: string;
  registered_by: string;
  created_at: number;
};

const toProfile = (row: ProfileRow): Profile => ({
  id: row.id,
  name: row.name,
  birthday: row.birthday,
  registeredBy: row.registered_by,
  createdAt: row.created_at,
});

export const listProfiles = async (env: Env): Promise<Profile[]> => {
  const { results } = await env.DB.prepare(
    'SELECT id, name, birthday, registered_by, created_at FROM uranai_profiles ORDER BY name'
  ).all<ProfileRow>();
  return results.map(toProfile);
};

export const getProfile = async (env: Env, id: string): Promise<Profile | null> => {
  const row = await env.DB.prepare(
    'SELECT id, name, birthday, registered_by, created_at FROM uranai_profiles WHERE id = ?'
  )
    .bind(id)
    .first<ProfileRow>();
  return row ? toProfile(row) : null;
};

type SaveProfileInput = {
  name: string;
  birthday: string;
  registeredBy: string;
};

export const saveProfile = async (env: Env, input: SaveProfileInput): Promise<Profile> => {
  const profile: Profile = {
    id: crypto.randomUUID().slice(0, 8),
    name: input.name,
    birthday: input.birthday,
    registeredBy: input.registeredBy,
    createdAt: Date.now(),
  };

  await env.DB.prepare(
    'INSERT INTO uranai_profiles (id, name, birthday, registered_by, created_at) VALUES (?, ?, ?, ?, ?)'
  )
    .bind(profile.id, profile.name, profile.birthday, profile.registeredBy, profile.createdAt)
    .run();

  return profile;
};
