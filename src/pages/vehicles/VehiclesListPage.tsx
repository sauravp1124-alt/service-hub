import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { vehiclesApi, Vehicle } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export const VehiclesListPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try { const res = await vehiclesApi.list({ limit: 100 }); setVehicles(res.vehicles || []); } 
    catch { toast({ title: 'Error', description: 'Failed to load vehicles', variant: 'destructive' }); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleDelete = async (id: string) => {
    try { await vehiclesApi.delete(id); toast({ title: 'Success', description: 'Vehicle deleted' }); fetchVehicles(); } 
    catch { toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' }); }
  };

  const filtered = vehicles.filter(v => v.vehicle_number.toLowerCase().includes(search.toLowerCase()) || v.make?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div><h1 className="text-3xl font-bold">Vehicles</h1><p className="text-muted-foreground">Manage registered vehicles</p></div>
        <Button asChild className="gradient-primary"><Link to="/vehicles/new"><Plus className="mr-2 h-4 w-4" />Add Vehicle</Link></Button>
      </div>
      <Card>
        <CardHeader><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div></CardHeader>
        <CardContent>
          {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div> : (
            <Table>
              <TableHeader><TableRow><TableHead>Vehicle No.</TableHead><TableHead>Make</TableHead><TableHead>Model</TableHead><TableHead>Year</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map(v => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.vehicle_number}</TableCell>
                    <TableCell>{v.make || '-'}</TableCell>
                    <TableCell>{v.model || '-'}</TableCell>
                    <TableCell>{v.year || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/vehicles/edit/${v.id}`)}><Edit className="h-4 w-4" /></Button>
                      <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Vehicle?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(v.id)} className="bg-destructive">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No vehicles found</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
