'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdminGetQuery, useAdminSaveMutation } from '@/lib/api';
import { PageTitle, Table } from '@/components/admin/ui';
import { toast } from '@/lib/slices';
import { errMsg, money, shortDate } from '@/lib/fmt';

export default function Users() {
  const { data = [] } = useAdminGetQuery('users');
  const me = useSelector((s) => s.auth.user);
  const [save] = useAdminSaveMutation();
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'STAFF' });
  const d = useDispatch();
  const run = async (args, msg) => { try { await save(args).unwrap(); d(toast(msg)); } catch (x) { d(toast(errMsg(x))); } };
  const isAdmin = me?.role === 'ADMIN';
  return (
    <>
      <PageTitle>Customers and staff</PageTitle>
      {isAdmin && (
        <form onSubmit={(e) => { e.preventDefault(); run({ path: 'users', body: f }, 'Account created.').then(() => setF({ name: '', email: '', password: '', role: 'STAFF' })); }} className="panel mb-6 grid gap-3 sm:grid-cols-5">
          <input required placeholder="Name" aria-label="Name" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input required type="email" placeholder="Email" aria-label="Email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <input required minLength={6} type="password" placeholder="Password" aria-label="Password" className="input" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <select aria-label="Role" className="input" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>{['STAFF', 'ADMIN'].map((r) => <option key={r}>{r}</option>)}</select>
          <button className="btn">Add staff</button>
        </form>)}
      <Table head={['Name', 'Contact', 'Orders', 'Spent', 'Joined', 'Role', 'Active']}>
        {data.map((u) => (
          <tr key={u.id}><td className="td">{u.name}</td><td className="td">{u.email}<span className="block text-xs text-muted">{u.phone}</span></td><td className="td">{u.orderCount}</td><td className="td">{money(u.spent)}</td><td className="td text-muted">{shortDate(u.createdAt)}</td>
            <td className="td">{isAdmin && u.id !== me.id ? <select aria-label="Role" className="input !w-auto !py-1 text-xs" value={u.role} onChange={(e) => run({ path: `users/${u.id}`, method: 'PUT', body: { role: e.target.value } }, 'Role updated.')}>{['CUSTOMER', 'STAFF', 'ADMIN'].map((r) => <option key={r}>{r}</option>)}</select> : u.role}</td>
            <td className="td">{isAdmin && u.id !== me.id ? <input type="checkbox" aria-label="Active" checked={u.active} onChange={(e) => run({ path: `users/${u.id}`, method: 'PUT', body: { active: e.target.checked } }, 'Account updated.')} /> : u.active ? 'Yes' : 'No'}</td></tr>))}
      </Table>
    </>
  );
}
