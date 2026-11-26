'use client';
import { useAdminGetQuery } from '@/lib/api';
import { PageTitle, Table } from '@/components/admin/ui';
import { dateTime } from '@/lib/fmt';

export default function Logs() {
  const { data = [] } = useAdminGetQuery('logs');
  return (
    <>
      <PageTitle>Activity log</PageTitle>
      <Table head={['When', 'Who', 'Action', 'Record', 'Details', 'IP']}>
        {data.map((l) => <tr key={l.id}><td className="td whitespace-nowrap text-muted">{dateTime(l.createdAt)}</td><td className="td">{l.userName || 'Guest'}</td><td className="td">{l.action}</td><td className="td">{l.entity}{l.entityId ? ` · ${l.entityId.slice(0, 8)}` : ''}</td><td className="td max-w-[260px] truncate text-xs text-muted">{l.meta ? JSON.stringify(l.meta) : ''}</td><td className="td text-xs text-muted">{l.ip}</td></tr>)}
      </Table>
    </>
  );
}
