import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { customersApi, Customer } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const CustomerFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', email: '', address: '', customer_type: 'individual' as 'individual' | 'business', gstin: '', notes: '' });

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      customersApi.get(id).then(c => setForm({ name: c.name, mobile: c.mobile, email: c.email || '', address: c.address || '', customer_type: c.customer_type, gstin: c.gstin || '', notes: c.notes || '' })).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.mobile) { toast({ title: 'Error', description: 'Name and mobile are required', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      if (isEdit) { await customersApi.update(id, form); } else { await customersApi.create(form); }
      toast({ title: 'Success', description: `Customer ${isEdit ? 'updated' : 'created'}` });
      navigate('/customers');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save customer', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-3xl font-bold">{isEdit ? 'Edit' : 'Add'} Customer</h1></div>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><Label>Mobile *</Label><Input value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div><Label>Customer Type</Label>
                <Select value={form.customer_type} onValueChange={v => setForm({...form, customer_type: v as 'individual' | 'business'})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="individual">Individual</SelectItem><SelectItem value="business">Business</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            {form.customer_type === 'business' && <div><Label>GSTIN</Label><Input value={form.gstin} onChange={e => setForm({...form, gstin: e.target.value})} /></div>}
            <div><Label>Address</Label><Textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="gradient-primary" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEdit ? 'Update' : 'Create'} Customer</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/customers')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
