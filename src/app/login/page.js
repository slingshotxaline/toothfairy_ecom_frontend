'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '@/lib/api';
import { setCredentials, toast } from '@/lib/slices';
import { errMsg } from '@/lib/fmt';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [login, a] = useLoginMutation();
  const [register, b] = useRegisterMutation();
  const d = useDispatch();
  const router = useRouter();
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await (mode === 'login' ? login(f) : register(f)).unwrap();
      d(setCredentials(r)); router.push(r.user.role === 'CUSTOMER' ? '/account' : '/admin');
    } catch (x) { d(toast(errMsg(x))); }
  };
  return (
    <form onSubmit={submit} className="panel mx-auto my-16 grid max-w-md gap-4">
      <h1 className="h-display text-4xl text-accent">{mode === 'login' ? 'Log in' : 'Create account'}</h1>
      {mode === 'register' && <><div><label className="label" htmlFor="rn">Name</label><input id="rn" required className="input" value={f.name} onChange={set('name')} /></div><div><label className="label" htmlFor="rp">Phone</label><input id="rp" className="input" value={f.phone} onChange={set('phone')} /></div></>}
      <div><label className="label" htmlFor="em">Email</label><input id="em" type="email" required className="input" value={f.email} onChange={set('email')} /></div>
      <div><label className="label" htmlFor="pw">Password</label><input id="pw" type="password" required minLength={6} className="input" value={f.password} onChange={set('password')} /></div>
      <button className="btn" disabled={a.isLoading || b.isLoading}>{mode === 'login' ? 'Log in' : 'Create account'}</button>
      <button type="button" className="text-xs text-muted underline" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}</button>
    </form>
  );
}
