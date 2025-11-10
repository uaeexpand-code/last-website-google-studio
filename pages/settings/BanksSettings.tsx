
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const BanksSettings: React.FC = () => {
    const { t } = useAppContext();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('settings.banks.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{t('settings.banks.no_banks')}</p>
            </CardContent>
        </Card>
    );
};

export default BanksSettings;
