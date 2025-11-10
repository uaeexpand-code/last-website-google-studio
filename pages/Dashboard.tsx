
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoaderCircle, WifiOff } from 'lucide-react';
import { Expense } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { formatToDdMmYyyy, getSmartDateDisplay } from '@/lib/dateUtils';
import { ICONS } from '@/constants/icons';
import { COLORS } from '@/constants/colors';

const Dashboard: React.FC = () => {
    const { t, isLoading, isSupabaseConnected, expenses, categories } = useAppContext();
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="flex flex-col items-center gap-4 text-center">
                    <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
                    <h2 className="text-xl font-semibold">{t('dashboard.loading')}</h2>
                </div>
            </div>
        );
    }

    if (!isSupabaseConnected) {
        return (
            <div className="p-4 md:p-8">
                <Alert variant="destructive">
                    <WifiOff className="h-4 w-4" />
                    <AlertTitle>{t('settings.general.not_connected')}</AlertTitle>
                    <AlertDescription>{t('dashboard.not_connected')}</AlertDescription>
                </Alert>
            </div>
        );
    }

    const getCategory = (id: string) => categories.find(c => c.id === id);

    return (
        <div className="p-4 md:p-8 animate-slide-up space-y-6">
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            
            {/* Placeholder for stats cards */}
            <div className="grid gap-4 md:grid-cols-3">
                 <Card>
                    <CardHeader><CardTitle>{t('dashboard.total_spent')}</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">... {t('currency')}</p></CardContent>
                 </Card>
                 <Card>
                    <CardHeader><CardTitle>{t('dashboard.paid')}</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">... {t('currency')}</p></CardContent>
                 </Card>
                 <Card>
                    <CardHeader><CardTitle>{t('dashboard.pending')}</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">... {t('currency')}</p></CardContent>
                 </Card>
            </div>

            <div className="space-y-4">
                 {expenses.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t('dashboard.no_expenses')}</p>
                 ) : (
                    expenses.map(exp => {
                        const category = getCategory(exp.categoryId);
                        if (!category) return null;
                        const Icon = ICONS[category.icon];
                        const colorClass = COLORS[category.color];

                        return (
                            <Card key={exp.id} className="overflow-hidden">
                                <div className="flex items-center">
                                    <div className={`p-4 bg-gradient-to-br ${colorClass} text-white`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div className="p-4 flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                        <div>
                                            <p className="font-bold text-lg">{category.name}</p>
                                            <p className="text-sm text-muted-foreground">{exp.description || '...'}</p>
                                        </div>
                                        <div className="text-right md:text-left">
                                            <p className="font-bold text-xl">{formatCurrency(exp.amount)}</p>
                                            <p className="text-sm">{t('currency')}</p>
                                        </div>
                                        <div className="text-left md:text-center col-span-2 md:col-span-1">
                                            <p className="font-semibold">{getSmartDateDisplay(exp.date, t)}</p>
                                            <p className="text-xs text-muted-foreground">{formatToDdMmYyyy(exp.date)}</p>
                                        </div>
                                         {/* Action buttons placeholder */}
                                        <div></div>
                                    </div>
                                </div>
                            </Card>
                        )
                    })
                 )}
            </div>
        </div>
    );
};

export default Dashboard;
