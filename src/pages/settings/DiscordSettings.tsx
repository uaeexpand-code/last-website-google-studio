import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const DiscordSettings: React.FC = () => {
    const { t } = useAppContext();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('settings.discord.title')}</CardTitle>
                <CardDescription>{t('settings.discord.webhook_url')}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Discord settings form will be here.</p>
            </CardContent>
        </Card>
    );
};

export default DiscordSettings;