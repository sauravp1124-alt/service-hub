import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { servicesApi, Service } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export const ServicesListPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]); const [loading, setLoading] = useState(true);
  const { toast } = useToast(); const navigate = useNavigate();
  const fetch = async () => { try { const res = await servicesApi.list({ limit: 100 }); setServices(res.services || []); } catch { toast({ title: 'Error', description: 'Failed', variant: 'destructive' }); } finally { setLoading(false); } };
  useEffect(() => { fetch(); }, []);
  const handleDelete = async (id: string) => { try { await servicesApi.delete(id); toast({ title: 'Success', description: 'Deleted' }); fetch(); } catch { toast({ title: 'Error', variant: 'destructive' }); } };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h1 className="text-3xl font-bold">Services</h1><p className="text-muted-foreground">Service types offered</p></div><Button asChild className="gradient-primary"><Link to="/services/new"><Plus className="mr-2 h-4 w-4" />Add Service</Link></Button></div>
      <Card><CardContent className="pt-6">
        {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div> : (
          <Table><TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Base Price</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{services.map(s => (<TableRow key={s.id}><TableCell className="font-medium">{s.code}</TableCell><TableCell>{s.name}</TableCell><TableCell>₹{s.base_price?.toFixed(2)}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => navigate(`/services/edit/${s.id}`)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(s.id)} className="bg-destructive">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}{services.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No services</TableCell></TableRow>}</TableBody>
          </Table>
        )}
      </CardContent></Card>
    </div>
  );
};
