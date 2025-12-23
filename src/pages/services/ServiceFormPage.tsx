import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { servicesApi, categoriesApi, Category } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const ServiceFormPage: React.FC = () => {
  const { id } = useParams(); const navigate = useNavigate(); const { toast } = useToast(); const isEdit = !!id;
  const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ category_id: '', code: '', name: '', description: '', base_price: 0, display_order: 0 });

  useEffect(() => {
    categoriesApi.list().then(setCategories);
    if (isEdit) { setLoading(true); servicesApi.get(id).then(s => setForm({ category_id: s.category_id, code: s.code, name: s.name, description: s.description || '', base_price: s.base_price, display_order: s.display_order })).finally(() => setLoading(false)); }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.name || !form.category_id) { toast({ title: 'Error', description: 'Required fields missing', variant: 'destructive' }); return; }
    setSaving(true);
    try { if (isEdit) await servicesApi.update(id, form); else await servicesApi.create(form); toast({ title: 'Success', description: `Service ${isEdit ? 'updated' : 'created'}` }); navigate('/services'); } catch { toast({ title: 'Error', variant: 'destructive' }); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/services')}><ArrowLeft className="h-5 w-5" /></Button><h1 className="text-3xl font-bold">{isEdit ? 'Edit' : 'Add'} Service</h1></div>
      <Card className="max-w-2xl"><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2"><div><Label>Code *</Label><Input value={form.code} onChange={e => setForm({...form, code: e.target.value})} /></div><div><Label>Category *</Label><Select value={form.category_id} onValueChange={v => setForm({...form, category_id: v})}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div></div>
          <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="grid gap-4 sm:grid-cols-2"><div><Label>Base Price (₹)</Label><Input type="number" step="0.01" value={form.base_price} onChange={e => setForm({...form, base_price: parseFloat(e.target.value) || 0})} /></div><div><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: parseInt(e.target.value) || 0})} /></div></div>
          <div className="flex gap-3 pt-4"><Button type="submit" className="gradient-primary" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEdit ? 'Update' : 'Create'}</Button><Button type="button" variant="outline" onClick={() => navigate('/services')}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};
