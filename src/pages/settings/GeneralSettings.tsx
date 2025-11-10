import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppSettings } from '@/types';
import { CheckCircle, LoaderCircle, WifiOff } from 'lucide-react';

const GeneralSettings: React.FC = () => {
    const { settings, updateSettings, t, isSupabaseConnected, isLoading } = useAppContext();
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        updateSettings(localSettings);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const ConnectionStatus = () => {
        if (isLoading && localSettings.supabaseUrl && localSettings.supabaseAnonKey) {
            return <div className="flex items-center gap-2 text-yellow-400"><LoaderCircle className="h-4 w-4 animate-spin"/> {t('settings.general.connecting')}</div>
        }
        if (isSupabaseConnected) {
            return <div className="flex items-center gap-2 text-green-400"><CheckCircle className="h-4 w-4"/> {t('settings.general.connected')}</div>
        }
        return <div className="flex items-center gap-2 text-red-400"><WifiOff className="h-4 w-4"/> {t('settings.general.not_connected')}</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('settings.general.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Supabase Settings */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t('settings.general.supabase_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('settings.general.supabase_desc')}</p>
                    
                    <Alert>
                        <AlertTitle>{t('settings.general.connection_status')}</AlertTitle>
                        <AlertDescription>
                            <ConnectionStatus />
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                        <Label htmlFor="supabaseUrl">{t('settings.general.supabase_url')}</Label>
                        <Input
                            id="supabaseUrl"
                            value={localSettings.supabaseUrl}
                            onChange={(e) => setLocalSettings({ ...localSettings, supabaseUrl: e.target.value })}
                            placeholder="https://your-project-ref.supabase.co"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="supabaseAnonKey">{t('settings.general.supabase_anon_key')}</Label>
                        <Input
                            id="supabaseAnonKey"
                            type="password"
                            value={localSettings.supabaseAnonKey}
                            onChange={(e) => setLocalSettings({ ...localSettings, supabaseAnonKey: e.target.value })}
                            placeholder="your-supabase-anon-key"
                        />
                    </div>
                </div>

                {/* Language Settings */}
                <div className="space-y-4">
                     <h3 className="text-lg font-semibold">{t('settings.general.language')}</h3>
                     <p className="text-sm text-muted-foreground">{t('settings.general.language_desc')}</p>
                     <div className="flex gap-2">
                        <Button variant={localSettings.language === 'en' ? 'default' : 'outline'} onClick={() => setLocalSettings({...localSettings, language: 'en'})}>{t('settings.general.english')}</Button>
                        <Button variant={localSettings.language === 'ar' ? 'default' : 'outline'} onClick={() => setLocalSettings({...localSettings, language: 'ar'})}>{t('settings.general.arabic')}</Button>
                     </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <Button onClick={handleSave}>{t('save')}</Button>
                    {showSuccess && <p className="text-sm text-green-400 animate-pulse">{t('settings.general.settings_saved')}</p>}
                </div>
            </CardContent>
        </Card>
    );
};

export default GeneralSettings;