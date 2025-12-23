import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { serviceRecordsApi, ServiceRecord } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = { pending: 'bg-warning/20 text-warning', in_progress: 'bg-info/20 text-info', completed: 'bg-success/20 text-success', cancelled: 'bg-destructive/20 text-destructive' };

export const ServiceRecordsListPage: React.FC = () => {
  const [records, setRecords] = useState<ServiceRecord[]>([]); const [loading, setLoading] = useState(true);
  const { toast } = useToast(); const navigate = useNavigate();
  const fetch = async () => { try { const res = await serviceRecordsApi.list({ limit: 100 }); setRecords(res.service_records || []); } catch { toast({ title: 'Error', variant: 'destructive' }); } finally { setLoading(false); } };
  useEffect(() => { fetch(); }, []);
  const handleDelete = async (id: string) => { try { await serviceRecordsApi.delete(id); toast({ title: 'Deleted' }); fetch(); } catch { toast({ title: 'Error', variant: 'destructive' }); } };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h1 className="text-3xl font-bold">Service Records</h1></div><Button asChild className="gradient-primary"><Link to="/service-records/new"><Plus className="mr-2 h-4 w-4" />New Record</Link></Button></div>
      <Card><CardContent className="pt-6">
        {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div> : (
          <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Total</TableHead><TableHead>Paid</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{records.map(r => (<TableRow key={r.id}><TableCell>{new Date(r.service_date).toLocaleDateString()}</TableCell><TableCell><Badge className={statusColors[r.status]}>{r.status.replace('_', ' ')}</Badge></TableCell><TableCell>₹{r.total_amount?.toFixed(2)}</TableCell><TableCell>₹{r.paid_amount?.toFixed(2)}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => navigate(`/service-records/edit/${r.id}`)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(r.id)} className="bg-destructive">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}{records.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No records</TableCell></TableRow>}</TableBody>
          </Table>
        )}
      </CardContent></Card>
    </div>
  );
};
