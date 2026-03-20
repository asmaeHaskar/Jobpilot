'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    bio: '',
  })

  useEffect(() => {
    const loadData = async () => {
      const session = await supabase.auth.getSession()
      if (!session.data.session) {
        router.push('/auth/login')
        return
      }

      const userId = session.data.session.user.id

      try {
        // Load profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (profileData) {
          setProfile(profileData)
          setFormData({
            fullName: profileData.full_name || '',
            location: profileData.location || '',
            bio: profileData.bio || '',
          })
        }

        // Load settings
        const { data: settingsData } = await supabase
          .from('settings')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (settingsData) {
          setSettings(settingsData)
        } else {
          // Create default settings if they don't exist
          const { data: newSettings } = await supabase
            .from('settings')
            .insert([{ user_id: userId }])
            .select()
            .single()

          setSettings(newSettings)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleProfileUpdate = async () => {
    setSaving(true)
    try {
      const session = await supabase.auth.getSession()
      const userId = session.data.session?.user.id

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          location: formData.location,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) throw error

      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSettingsUpdate = async (key: string, value: any) => {
    try {
      const session = await supabase.auth.getSession()
      const userId = session.data.session?.user.id

      const { error } = await supabase
        .from('settings')
        .update({ [key]: value })
        .eq('user_id', userId)

      if (error) throw error

      setSettings({ ...settings, [key]: value })
      toast.success('Settings updated successfully!')
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and application preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="San Francisco, CA"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="w-full p-3 border border-input rounded-lg text-sm"
              rows={4}
            />
          </div>

          <Button onClick={handleProfileUpdate} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* Application Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Control how you apply to jobs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your applications
              </p>
            </div>
            <Switch
              checked={settings?.email_notifications || false}
              onCheckedChange={(checked) =>
                handleSettingsUpdate('email_notifications', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-Apply Feature</p>
              <p className="text-sm text-muted-foreground">
                Enable automatic applications to matching jobs
              </p>
            </div>
            <Switch
              checked={settings?.auto_apply_enabled || false}
              onCheckedChange={(checked) => handleSettingsUpdate('auto_apply_enabled', checked)}
            />
          </div>

          {settings?.auto_apply_enabled && (
            <div className="space-y-2 pt-4 border-t">
              <label className="text-sm font-medium">
                Max Applications Per Day
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                value={settings?.auto_apply_max_per_day || 5}
                onChange={(e) =>
                  handleSettingsUpdate('auto_apply_max_per_day', parseInt(e.target.value))
                }
              />
              <p className="text-xs text-muted-foreground">
                Limit the number of automatic applications per day
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email for Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Email</CardTitle>
          <CardDescription>Email used for job applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Application Email</label>
            <Input
              type="email"
              value={settings?.email_for_applications || profile?.email || ''}
              onChange={(e) => handleSettingsUpdate('email_for_applications', e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This email will be used when applying to jobs
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
