'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAdminDeleteMutation, useAdminGetQuery, useAdminSaveMutation, useUploadMutation } from '@/lib/api';
import { toast } from '@/lib/slices';
import { errMsg } from '@/lib/fmt';

export const PageTitle = ({ children, action }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="h-display text-3xl text-accent md:text-4xl">{children}</h1>{action}</div>
);
export const Table = ({ head, children }) => (
  <div className="overflow-x-auto border border-line"><table className="w-full min-w-[640px] text-left"><thead className="border-b border-line bg-surface"><tr>{head.map((h) => <th key={h} className="th">{h}</th>)}</tr></thead><tbody className="divide-y divide-line">{children}</tbody></table></div>
);

export function ImageInput({ value, onChange, label = 'Image' }) {
  const [up, { isLoading }] = useUploadMutation();
  const d = useDispatch();
  const pick = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try { onChange((await up(file).unwrap()).url); } catch (x) { d(toast(errMsg(x))); }
  };
  return (
    <div><span className="label">{label}</span>
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="" className="h-16 w-14 border border-line object-cover" />}
        <label className="btn-ghost cursor-pointer">{isLoading ? 'Uploading…' : value ? 'Replace' : 'Upload'}<input type="file" accept="image/*" hidden onChange={pick} /></label>
        {value && <button type="button" className="text-xs text-muted underline" onClick={() => onChange('')}>Remove</button>}
      </div>
    </div>
  );
}

export function Bars({ data, x, y, fmt = (v) => v }) {
  const max = Math.max(1, ...data.map((r) => r[y]));
  return (
    <div className="flex h-40 items-end gap-[3px]" role="img" aria-label="Bar chart">
      {data.map((r) => <div key={r[x]} title={`${r[x]}: ${fmt(r[y])}`} className="flex-1 bg-accent opacity-80 hover:opacity-100" style={{ height: `${Math.max((r[y] / max) * 100, 2)}%` }} />)}
    </div>
  );
}

const toInput = (f, v) => (f.type === 'date' && v ? String(v).slice(0, 10) : v ?? (f.type === 'checkbox' ? true : ''));

// Generic list + form page for simple resources (categories, brands, coupons, shipping rules).
export function ResourcePage({ title, path, fields, columns, blank = {} }) {
  const { data = [] } = useAdminGetQuery(path);
  const [save, { isLoading }] = useAdminSaveMutation();
  const [del] = useAdminDeleteMutation();
  const [form, setForm] = useState(null);
  const d = useDispatch();
  const open = (row) => setForm(row
    ? { id: row.id, ...Object.fromEntries(fields.map((f) => [f.name, toInput(f, row[f.name])])) }
    : { ...Object.fromEntries(fields.map((f) => [f.name, f.type === 'checkbox' ? true : ''])), ...blank });
  const submit = async (e) => {
    e.preventDefault();
    try { await save({ path: form.id ? `${path}/${form.id}` : path, method: form.id ? 'PUT' : 'POST', body: form }).unwrap(); setForm(null); d(toast('Saved.')); } catch (x) { d(toast(errMsg(x))); }
  };
  const remove = async (row) => { if (confirm('Delete this item?')) try { await del(`${path}/${row.id}`).unwrap(); d(toast('Deleted.')); } catch (x) { d(toast(errMsg(x))); } };
  return (
    <>
      <PageTitle action={<button className="btn" onClick={() => open()}>Add new</button>}>{title}</PageTitle>
      {form && (
        <form onSubmit={submit} className="panel mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f) => (
            <div key={f.name} className={f.type === 'image' ? 'sm:col-span-2' : ''}>
              {f.type === 'image' ? <ImageInput label={f.label} value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />
                : f.type === 'checkbox' ? <label className="mt-6 flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} />{f.label}</label>
                : <><label className="label" htmlFor={`f-${f.name}`}>{f.label}</label>
                  {f.type === 'select' ? <select id={`f-${f.name}`} className="input" value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
                    : <input id={`f-${f.name}`} type={f.type || 'text'} step="any" required={f.required} className="input" value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />}</>}
            </div>))}
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3"><button className="btn" disabled={isLoading}>Save</button><button type="button" className="btn-ghost" onClick={() => setForm(null)}>Cancel</button></div>
        </form>)}
      <Table head={[...columns.map((c) => c.label), '']}>
        {data.map((row) => (
          <tr key={row.id}>{columns.map((c) => <td key={c.label} className="td">{c.render ? c.render(row) : String(row[c.key] ?? '')}</td>)}
            <td className="td whitespace-nowrap text-right"><button className="mr-3 text-xs underline" onClick={() => open(row)}>Edit</button><button className="text-xs text-muted underline" onClick={() => remove(row)}>Delete</button></td></tr>))}
        {!data.length && <tr><td className="td text-muted" colSpan={columns.length + 1}>Nothing here yet.</td></tr>}
      </Table>
    </>
  );
}
