import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { paymentsApi, Payment } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const methodColors: Record<string, string> = { cash: 'bg-success/20 text-success', card: 'bg-info/20 text-info', upi: 'bg-primary/20 text-primary', bank_transfer: 'bg-secondary/20 text-secondary-foreground' };

export const PaymentsListPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]); const [loading, setLoading] = useState(true);
  const { toast } = useToast(); const navigate = useNavigate();
  const fetch = async () => { try { const res = await paymentsApi.list({ limit: 100 }); setPayments(res.payments || []); } catch { toast({ title: 'Error', variant: 'destructive' }); } finally { setLoading(false); } };
  useEffect(() => { fetch(); }, []);
  const handleDelete = async (id: string) => { try { await paymentsApi.delete(id); toast({ title: 'Deleted' }); fetch(); } catch { toast({ title: 'Error', variant: 'destructive' }); } };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h1 className="text-3xl font-bold">Payments</h1></div><Button asChild className="gradient-primary"><Link to="/payments/new"><Plus className="mr-2 h-4 w-4" />Record Payment</Link></Button></div>
      <Card><CardContent className="pt-6">
        {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div> : (
          <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Transaction ID</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{payments.map(p => (<TableRow key={p.id}><TableCell>{new Date(p.payment_date).toLocaleDateString()}</TableCell><TableCell className="font-medium">₹{p.amount?.toFixed(2)}</TableCell><TableCell><Badge className={methodColors[p.payment_method]}>{p.payment_method.replace('_', ' ')}</Badge></TableCell><TableCell>{p.transaction_id || '-'}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => navigate(`/payments/edit/${p.id}`)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-destructive">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}{payments.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No payments</TableCell></TableRow>}</TableBody>
          </Table>
        )}
      </CardContent></Card>
    </div>
  );
};
