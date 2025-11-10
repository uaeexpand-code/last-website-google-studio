
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AddExpense: React.FC = () => {
    const { t } = useAppContext();

    return (
        <div className="p-4 md:p-8 animate-slide-up">
            <Card>
                <CardHeader>
                    <CardTitle>{t('add_expense.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Add expense form will be here.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddExpense;
