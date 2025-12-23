import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { categoriesApi, Category } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export const CategoriesListPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]); const [loading, setLoading] = useState(true);
  const { toast } = useToast(); const navigate = useNavigate();
  const fetchCategories = async () => { try { setCategories(await categoriesApi.list()); } catch { toast({ title: 'Error', description: 'Failed to load', variant: 'destructive' }); } finally { setLoading(false); } };
  useEffect(() => { fetchCategories(); }, []);
  const handleDelete = async (id: string) => { try { await categoriesApi.delete(id); toast({ title: 'Success', description: 'Deleted' }); fetchCategories(); } catch { toast({ title: 'Error', description: 'Failed', variant: 'destructive' }); } };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h1 className="text-3xl font-bold">Categories</h1><p className="text-muted-foreground">Vehicle type categories</p></div><Button asChild className="gradient-primary"><Link to="/categories/new"><Plus className="mr-2 h-4 w-4" />Add Category</Link></Button></div>
      <Card><CardContent className="pt-6">
        {loading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div> : (
          <Table><TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Order</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{categories.map(c => (<TableRow key={c.id}><TableCell className="font-medium">{c.code}</TableCell><TableCell>{c.name}</TableCell><TableCell>{c.description || '-'}</TableCell><TableCell>{c.display_order}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => navigate(`/categories/edit/${c.id}`)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(c.id)} className="bg-destructive">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}{categories.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No categories</TableCell></TableRow>}</TableBody>
          </Table>
        )}
      </CardContent></Card>
    </div>
  );
};
