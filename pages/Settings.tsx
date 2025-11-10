
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GeneralSettings from './settings/GeneralSettings';
import CategoriesSettings from './settings/CategoriesSettings';
import BanksSettings from './settings/BanksSettings';
import DiscordSettings from './settings/DiscordSettings';


const Settings: React.FC = () => {
    const { t } = useAppContext();

    return (
        <div className="p-4 md:p-8 animate-slide-up">
            <h1 className="text-3xl font-bold mb-6">{t('settings.title')}</h1>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="general">{t('settings.tabs.general')}</TabsTrigger>
                    <TabsTrigger value="categories">{t('settings.tabs.categories')}</TabsTrigger>
                    <TabsTrigger value="banks">{t('settings.tabs.banks')}</TabsTrigger>
                    <TabsTrigger value="discord">{t('settings.tabs.discord')}</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <GeneralSettings />
                </TabsContent>
                <TabsContent value="categories">
                    <CategoriesSettings />
                </TabsContent>
                <TabsContent value="banks">
                    <BanksSettings />
                </TabsContent>
                <TabsContent value="discord">
                    <DiscordSettings />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
