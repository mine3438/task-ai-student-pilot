
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Palette, Bot, Shield, Download, Trash2 } from "lucide-react";

export const Settings = () => {
  const { toast } = useToast();
  
  // Profile settings state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyDigest: true,
    reminderTiming: "1h"
  });

  // App preferences state
  const [preferences, setPreferences] = useState({
    theme: "light",
    defaultPriority: "medium",
    defaultCategory: "assignment",
    autoSave: true
  });

  // AI assistant settings state
  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    suggestions: true,
    autoComplete: false,
    smartDeadlines: true
  });

  const handleProfileSave = () => {
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully."
    });
    
    // Clear password fields
    setProfile(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  const handleNotificationSave = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved."
    });
  };

  const handlePreferencesSave = () => {
    toast({
      title: "Preferences Updated",
      description: "Your app preferences have been saved."
    });
  };

  const handleAiSettingsSave = () => {
    toast({
      title: "AI Settings Updated",
      description: "Your AI assistant settings have been saved."
    });
  };

  const handleExportData = () => {
    // Simulate data export
    const data = {
      profile,
      notifications,
      preferences,
      aiSettings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'studyflow-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your data has been downloaded as a JSON file."
    });
  };

  const handleDeleteAccount = () => {
    // This would typically show a confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (confirmed) {
      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted. You will receive a confirmation email.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and application preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>Update your personal information and password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-medium">Change Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={profile.currentPassword}
                  onChange={(e) => setProfile(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={profile.newPassword}
                  onChange={(e) => setProfile(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={profile.confirmPassword}
                  onChange={(e) => setProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <Button onClick={handleProfileSave} className="w-full md:w-auto">
            Save Profile Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive browser notifications</p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="task-reminders">Task Reminders</Label>
                <p className="text-sm text-gray-600">Get reminded about upcoming deadlines</p>
              </div>
              <Switch
                id="task-reminders"
                checked={notifications.taskReminders}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, taskReminders: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-digest">Weekly Digest</Label>
                <p className="text-sm text-gray-600">Weekly summary of your tasks</p>
              </div>
              <Switch
                id="weekly-digest"
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyDigest: checked }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Reminder Timing</Label>
              <Select value={notifications.reminderTiming} onValueChange={(value) => setNotifications(prev => ({ ...prev, reminderTiming: value }))}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes before</SelectItem>
                  <SelectItem value="30m">30 minutes before</SelectItem>
                  <SelectItem value="1h">1 hour before</SelectItem>
                  <SelectItem value="2h">2 hours before</SelectItem>
                  <SelectItem value="1d">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleNotificationSave} className="w-full md:w-auto">
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            App Preferences
          </CardTitle>
          <CardDescription>Customize your app experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Default Priority</Label>
              <Select value={preferences.defaultPriority} onValueChange={(value) => setPreferences(prev => ({ ...prev, defaultPriority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Default Category</Label>
              <Select value={preferences.defaultCategory} onValueChange={(value) => setPreferences(prev => ({ ...prev, defaultCategory: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save">Auto Save</Label>
                <p className="text-sm text-gray-600">Automatically save changes</p>
              </div>
              <Switch
                id="auto-save"
                checked={preferences.autoSave}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoSave: checked }))}
              />
            </div>
          </div>
          
          <Button onClick={handlePreferencesSave} className="w-full md:w-auto">
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* AI Assistant Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant Settings
          </CardTitle>
          <CardDescription>Configure your AI assistant preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-enabled">Enable AI Assistant</Label>
                <p className="text-sm text-gray-600">Turn on/off AI features</p>
              </div>
              <Switch
                id="ai-enabled"
                checked={aiSettings.enabled}
                onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, enabled: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-suggestions">Smart Suggestions</Label>
                <p className="text-sm text-gray-600">Get AI-powered task suggestions</p>
              </div>
              <Switch
                id="ai-suggestions"
                checked={aiSettings.suggestions}
                onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, suggestions: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-autocomplete">Auto-complete Tasks</Label>
                <p className="text-sm text-gray-600">AI helps complete task descriptions</p>
              </div>
              <Switch
                id="ai-autocomplete"
                checked={aiSettings.autoComplete}
                onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, autoComplete: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smart-deadlines">Smart Deadlines</Label>
                <p className="text-sm text-gray-600">AI suggests optimal deadlines</p>
              </div>
              <Switch
                id="smart-deadlines"
                checked={aiSettings.smartDeadlines}
                onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, smartDeadlines: checked }))}
              />
            </div>
          </div>
          
          <Button onClick={handleAiSettingsSave} className="w-full md:w-auto">
            Save AI Settings
          </Button>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Manage your data and account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Data Export</h4>
              <p className="text-sm text-gray-600 mb-3">
                Download all your data in JSON format
              </p>
              <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export My Data
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2 text-red-600">Danger Zone</h4>
              <p className="text-sm text-gray-600 mb-3">
                Permanently delete your account and all associated data
              </p>
              <Button onClick={handleDeleteAccount} variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
