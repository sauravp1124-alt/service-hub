import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { serviceRecordsApi, customersApi, vehiclesApi, Customer, Vehicle } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const ServiceRecordFormPage: React.FC = () => {
  const { id } = useParams(); const navigate = useNavigate(); const { toast } = useToast(); const isEdit = !!id;
  const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]); const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState<{ customer_id: string; vehicle_id: string; service_date: string; status: 'pending' | 'in_progress' | 'completed' | 'cancelled'; total_amount: number; paid_amount: number; notes: string; services: any[] }>({ customer_id: '', vehicle_id: '', service_date: new Date().toISOString().split('T')[0], status: 'pending', total_amount: 0, paid_amount: 0, notes: '', services: [] });

  useEffect(() => {
    customersApi.list({ limit: 1000 }).then(r => setCustomers(r.customers || []));
    vehiclesApi.list({ limit: 1000 }).then(r => setVehicles(r.vehicles || []));
    if (isEdit) { setLoading(true); serviceRecordsApi.get(id).then(r => setForm({ customer_id: r.customer_id, vehicle_id: r.vehicle_id, service_date: r.service_date, status: r.status, total_amount: r.total_amount, paid_amount: r.paid_amount, notes: r.notes || '', services: r.services || [] })).finally(() => setLoading(false)); }
  }, [id, isEdit]);

  const filteredVehicles = vehicles.filter(v => v.customer_id === form.customer_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_id || !form.vehicle_id) { toast({ title: 'Error', description: 'Required fields missing', variant: 'destructive' }); return; }
    setSaving(true);
    try { if (isEdit) await serviceRecordsApi.update(id, form); else await serviceRecordsApi.create(form); toast({ title: 'Success' }); navigate('/service-records'); } catch { toast({ title: 'Error', variant: 'destructive' }); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/service-records')}><ArrowLeft className="h-5 w-5" /></Button><h1 className="text-3xl font-bold">{isEdit ? 'Edit' : 'New'} Service Record</h1></div>
      <Card className="max-w-2xl"><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2"><div><Label>Customer *</Label><Select value={form.customer_id} onValueChange={v => setForm({...form, customer_id: v, vehicle_id: ''})}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Vehicle *</Label><Select value={form.vehicle_id} onValueChange={v => setForm({...form, vehicle_id: v})} disabled={!form.customer_id}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{filteredVehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.vehicle_number}</SelectItem>)}</SelectContent></Select></div></div>
          <div className="grid gap-4 sm:grid-cols-2"><div><Label>Service Date</Label><Input type="date" value={form.service_date} onChange={e => setForm({...form, service_date: e.target.value})} /></div><div><Label>Status</Label><Select value={form.status} onValueChange={v => setForm({...form, status: v as any})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select></div></div>
          <div className="grid gap-4 sm:grid-cols-2"><div><Label>Total Amount (₹)</Label><Input type="number" step="0.01" value={form.total_amount} onChange={e => setForm({...form, total_amount: parseFloat(e.target.value) || 0})} /></div><div><Label>Paid Amount (₹)</Label><Input type="number" step="0.01" value={form.paid_amount} onChange={e => setForm({...form, paid_amount: parseFloat(e.target.value) || 0})} /></div></div>
          <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
          <div className="flex gap-3 pt-4"><Button type="submit" className="gradient-primary" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEdit ? 'Update' : 'Create'}</Button><Button type="button" variant="outline" onClick={() => navigate('/service-records')}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};
