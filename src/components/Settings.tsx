
import { useState } from "react";
import { Bell, Moon, Sun, User, Shield, Brain, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export const Settings = () => {
  const [settings, setSettings] = useState({
    profile: {
      name: "John Doe",
      email: "john.doe@student.edu",
      bio: "Computer Science student focused on AI and machine learning."
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      dailyReminders: true,
      weeklyReport: false,
      reminderTime: "09:00"
    },
    preferences: {
      theme: "light",
      defaultPriority: "Medium",
      defaultCategory: "Assignment",
      autoSave: true,
      showCompletedTasks: false
    },
    ai: {
      enableSuggestions: true,
      suggestionFrequency: "daily",
      motivationalMessages: true,
      smartScheduling: true
    }
  });

  const updateSettings = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <User className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Profile Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name"
              value={settings.profile.name}
              onChange={(e) => updateSettings('profile', 'name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email"
              type="email"
              value={settings.profile.email}
              onChange={(e) => updateSettings('profile', 'email', e.target.value)}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio"
              value={settings.profile.bio}
              onChange={(e) => updateSettings('profile', 'bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold">Notification Preferences</h2>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive task reminders and updates via email</p>
            </div>
            <Switch 
              id="email-notifications"
              checked={settings.notifications.emailNotifications}
              onCheckedChange={(checked) => updateSettings('notifications', 'emailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-gray-600">Get browser notifications for important updates</p>
            </div>
            <Switch 
              id="push-notifications"
              checked={settings.notifications.pushNotifications}
              onCheckedChange={(checked) => updateSettings('notifications', 'pushNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="daily-reminders">Daily Reminders</Label>
              <p className="text-sm text-gray-600">Get daily task summaries</p>
            </div>
            <Switch 
              id="daily-reminders"
              checked={settings.notifications.dailyReminders}
              onCheckedChange={(checked) => updateSettings('notifications', 'dailyReminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-report">Weekly Progress Report</Label>
              <p className="text-sm text-gray-600">Receive weekly productivity insights</p>
            </div>
            <Switch 
              id="weekly-report"
              checked={settings.notifications.weeklyReport}
              onCheckedChange={(checked) => updateSettings('notifications', 'weeklyReport', checked)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Daily Reminder Time</Label>
              <Input 
                id="reminder-time"
                type="time"
                value={settings.notifications.reminderTime}
                onChange={(e) => updateSettings('notifications', 'reminderTime', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <Palette className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold">App Preferences</h2>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={settings.preferences.theme}
                onValueChange={(value) => updateSettings('preferences', 'theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-priority">Default Task Priority</Label>
              <Select 
                value={settings.preferences.defaultPriority}
                onValueChange={(value) => updateSettings('preferences', 'defaultPriority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-category">Default Task Category</Label>
              <Select 
                value={settings.preferences.defaultCategory}
                onValueChange={(value) => updateSettings('preferences', 'defaultCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Assignment">Assignment</SelectItem>
                  <SelectItem value="Exam">Exam</SelectItem>
                  <SelectItem value="Study">Study</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save">Auto-save Changes</Label>
              <p className="text-sm text-gray-600">Automatically save task edits</p>
            </div>
            <Switch 
              id="auto-save"
              checked={settings.preferences.autoSave}
              onCheckedChange={(checked) => updateSettings('preferences', 'autoSave', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-completed">Show Completed Tasks</Label>
              <p className="text-sm text-gray-600">Display completed tasks in lists</p>
            </div>
            <Switch 
              id="show-completed"
              checked={settings.preferences.showCompletedTasks}
              onCheckedChange={(checked) => updateSettings('preferences', 'showCompletedTasks', checked)}
            />
          </div>
        </div>
      </div>

      {/* AI Assistant Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">AI Assistant Settings</h2>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ai-suggestions">Enable AI Suggestions</Label>
              <p className="text-sm text-gray-600">Get smart recommendations for task management</p>
            </div>
            <Switch 
              id="ai-suggestions"
              checked={settings.ai.enableSuggestions}
              onCheckedChange={(checked) => updateSettings('ai', 'enableSuggestions', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="motivational-messages">Motivational Messages</Label>
              <p className="text-sm text-gray-600">Receive encouraging tips and quotes</p>
            </div>
            <Switch 
              id="motivational-messages"
              checked={settings.ai.motivationalMessages}
              onCheckedChange={(checked) => updateSettings('ai', 'motivationalMessages', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smart-scheduling">Smart Scheduling</Label>
              <p className="text-sm text-gray-600">AI-powered task scheduling optimization</p>
            </div>
            <Switch 
              id="smart-scheduling"
              checked={settings.ai.smartScheduling}
              onCheckedChange={(checked) => updateSettings('ai', 'smartScheduling', checked)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="suggestion-frequency">Suggestion Frequency</Label>
            <Select 
              value={settings.ai.suggestionFrequency}
              onValueChange={(value) => updateSettings('ai', 'suggestionFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="manual">Manual only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-semibold">Privacy & Security</h2>
        </div>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            Export My Data
          </Button>
          
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
            Delete Account
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Save Changes
        </Button>
      </div>
    </div>
  );
};
