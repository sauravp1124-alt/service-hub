import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { vehiclesApi, customersApi, categoriesApi, Vehicle, Customer, Category } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const VehicleFormPage: React.FC = () => {
  const { id } = useParams(); const navigate = useNavigate(); const { toast } = useToast(); const isEdit = !!id;
  const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]); const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ customer_id: '', category_id: '', vehicle_number: '', make: '', model: '', year: '' });

  useEffect(() => {
    Promise.all([customersApi.list({ limit: 1000 }), categoriesApi.list()]).then(([c, cat]) => { setCustomers(c.customers || []); setCategories(cat || []); });
    if (isEdit) { setLoading(true); vehiclesApi.get(id).then(v => setForm({ customer_id: v.customer_id, category_id: v.category_id, vehicle_number: v.vehicle_number, make: v.make || '', model: v.model || '', year: v.year?.toString() || '' })).finally(() => setLoading(false)); }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_id || !form.category_id || !form.vehicle_number) { toast({ title: 'Error', description: 'Required fields missing', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const data = { ...form, year: form.year ? parseInt(form.year) : undefined };
      if (isEdit) await vehiclesApi.update(id, data); else await vehiclesApi.create(data as any);
      toast({ title: 'Success', description: `Vehicle ${isEdit ? 'updated' : 'created'}` }); navigate('/vehicles');
    } catch { toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' }); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/vehicles')}><ArrowLeft className="h-5 w-5" /></Button><h1 className="text-3xl font-bold">{isEdit ? 'Edit' : 'Add'} Vehicle</h1></div>
      <Card className="max-w-2xl"><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Customer *</Label><Select value={form.customer_id} onValueChange={v => setForm({...form, customer_id: v})}><SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger><SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Category *</Label><Select value={form.category_id} onValueChange={v => setForm({...form, category_id: v})}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div><Label>Vehicle Number *</Label><Input value={form.vehicle_number} onChange={e => setForm({...form, vehicle_number: e.target.value})} /></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Make</Label><Input value={form.make} onChange={e => setForm({...form, make: e.target.value})} /></div>
            <div><Label>Model</Label><Input value={form.model} onChange={e => setForm({...form, model: e.target.value})} /></div>
            <div><Label>Year</Label><Input type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} /></div>
          </div>
          <div className="flex gap-3 pt-4"><Button type="submit" className="gradient-primary" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEdit ? 'Update' : 'Create'}</Button><Button type="button" variant="outline" onClick={() => navigate('/vehicles')}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};
