'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAdminGetQuery, useAdminSaveMutation } from '@/lib/api';
import { toast } from '@/lib/slices';
import { errMsg } from '@/lib/fmt';

// Load a Setting row by key, edit it locally, and save it back (ADMIN only).
export function useSetting(key, fallback) {
  const { data } = useAdminGetQuery(`settings/${key}`);
  const [save, { isLoading }] = useAdminSaveMutation();
  const [v, setV] = useState(fallback);
  const d = useDispatch();
  useEffect(() => { if (data) setV({ ...fallback, ...data }); }, [data]); // eslint-disable-line
  const commit = async (value = v) => { try { await save({ path: `settings/${key}`, method: 'PUT', body: { value } }).unwrap(); d(toast('Saved.')); } catch (x) { d(toast(errMsg(x))); } };
  return [v, setV, commit, isLoading];
}
