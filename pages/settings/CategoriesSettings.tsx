
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CategoriesSettings: React.FC = () => {
    const { t } = useAppContext();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('settings.categories.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{t('settings.categories.no_categories')}</p>
            </CardContent>
        </Card>
    );
};

export default CategoriesSettings;
