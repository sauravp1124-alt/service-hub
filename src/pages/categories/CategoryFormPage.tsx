import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { categoriesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const CategoryFormPage: React.FC = () => {
  const { id } = useParams(); const navigate = useNavigate(); const { toast } = useToast(); const isEdit = !!id;
  const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', description: '', display_order: 0 });

  useEffect(() => { if (isEdit) { setLoading(true); categoriesApi.get(id).then(c => setForm({ code: c.code, name: c.name, description: c.description || '', display_order: c.display_order })).finally(() => setLoading(false)); } }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.name) { toast({ title: 'Error', description: 'Code and name required', variant: 'destructive' }); return; }
    setSaving(true);
    try { if (isEdit) await categoriesApi.update(id, form); else await categoriesApi.create(form); toast({ title: 'Success', description: `Category ${isEdit ? 'updated' : 'created'}` }); navigate('/categories'); } catch { toast({ title: 'Error', description: 'Failed', variant: 'destructive' }); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/categories')}><ArrowLeft className="h-5 w-5" /></Button><h1 className="text-3xl font-bold">{isEdit ? 'Edit' : 'Add'} Category</h1></div>
      <Card className="max-w-2xl"><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2"><div><Label>Code *</Label><Input value={form.code} onChange={e => setForm({...form, code: e.target.value})} placeholder="e.g., 2W" /></div><div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., 2-Wheeler" /></div></div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: parseInt(e.target.value) || 0})} /></div>
          <div className="flex gap-3 pt-4"><Button type="submit" className="gradient-primary" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isEdit ? 'Update' : 'Create'}</Button><Button type="button" variant="outline" onClick={() => navigate('/categories')}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};
