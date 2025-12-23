import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { paymentsApi, serviceRecordsApi, ServiceRecord } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const PaymentFormPage: React.FC = () => {
  const { id } = useParams(); const navigate = useNavigate(); const { toast } = useToast(); const isEdit = !!id;
  const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false);
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [form, setForm] = useState<{ service_record_id: string; amount: number; payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer'; payment_date: string; transaction_id: string; notes: string }>({ service_record_id: '', amount: 0, payment_method: 'cash', payment_date: new Date().toISOString().split('T')[0], transaction_id: '', notes: '' });

  useEffect(() => {
    serviceRecordsApi.list({ limit: 1000 }).then(r => setRecords(r.service_records || []));
    if (isEdit) { setLoading(true); paymentsApi.get(id).then(p => setForm({ service_record_id: p.service_record_id, amount: p.amount, payment_method: p.payment_method, payment_date: p.payment_date, transaction_id: p.transaction_id || '', notes: p.notes || '' })).finally(() => setLoading(false)); }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service_record_id || !form.amount) { toast({ title: 'Error', description: 'Required fields missing', variant: 'destructive' }); return; }
    setSaving(true);
    try { if (isEdit) await paymentsApi.update(id, form); else await paymentsApi.create(form); toast({ title: 'Success' }); navigate('/payments'); } catch { toast({ title: 'Error', variant: 'destructive' }); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/payments')}><ArrowLeft className="h-5 w-5" /></Button><h1 className="text-3xl font-bold">{isEdit ? 'Edit' : 'Record'} Payment</h1></div>
      <Card className="max-w-2xl"><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Service Record *</Label><Select value={form.service_record_id} onValueChange={v => setForm({...form, service_record_id: v})}><SelectTrigger><SelectValue placeholder="Select record" /></SelectTrigger><SelectContent>{records.map(r => <SelectItem key={r.id} value={r.id}>{r.service_date} - ₹{r.total_amount}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid gap-4 sm:grid-cols-2"><div><Label>Amount (₹) *</Label><Input type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: parseFloat(e.target.value) || 0})} /></div><div><Label>Payment Method</Label><Select value={form.payment_method} onValueChange={v => setForm({...form, payment_method: v as any})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="card">Card</SelectItem><SelectItem value="upi">UPI</SelectItem><SelectItem value="bank_transfer">Bank Transfer</SelectItem></SelectContent></Select></div></div>
          <div className="grid gap-4 sm:grid-cols-2"><div><Label>Payment Date</Label><Input type="date" value={form.payment_date} onChange={e => setForm({...form, payment_date: e.target.value})} /></div><div><Label>Transaction ID</Label><Input value={form.transaction_id} onChange={e => setForm({...form, transaction_id: e.target.value})} /></div></div>
          <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
          <div className="flex gap-3 pt-4"><Button type="submit" className="gradient-primary" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEdit ? 'Update' : 'Record'}</Button><Button type="button" variant="outline" onClick={() => navigate('/payments')}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};
