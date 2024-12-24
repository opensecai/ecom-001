import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    logo_url: '',
    favicon_url: '',
    primary_color: '#3b82f6',
    whatsapp_number: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      if (data) {
        setSettings(data);
      }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(settings);

      if (error) throw error;

      toast({
        title: 'Settings updated',
        description: 'Your changes have been saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="backdrop-blur-sm bg-card/50">
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={settings.logo_url}
                onChange={(e) =>
                  setSettings({ ...settings, logo_url: e.target.value })
                }
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input
                id="favicon"
                value={settings.favicon_url}
                onChange={(e) =>
                  setSettings({ ...settings, favicon_url: e.target.value })
                }
                placeholder="https://example.com/favicon.ico"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Primary Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="color"
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) =>
                    setSettings({ ...settings, primary_color: e.target.value })
                  }
                  className="w-20"
                />
                <Input
                  value={settings.primary_color}
                  onChange={(e) =>
                    setSettings({ ...settings, primary_color: e.target.value })
                  }
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Business Number</Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp_number}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp_number: e.target.value })
                }
                placeholder="+1234567890"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}