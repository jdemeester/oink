import { Ionicons } from '@expo/vector-icons';
import { Avatar, Button, Card, Chip, Surface, cn } from 'heroui-native';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../components/app-text';
import { useAppTheme } from '../../contexts/app-theme-context';

const StyledIonicons = withUniwind(Ionicons);

// Mock data
const METRICS = [
  { label: 'Active Deals', value: '12', color: 'bg-blue-500', icon: 'briefcase-outline' },
  { label: 'Follow-ups Due', value: '5', color: 'bg-amber-500', icon: 'calendar-outline' },
  { label: 'New Leads', value: '8', color: 'bg-emerald-500', icon: 'person-add-outline' },
];

const RECENT_ACTIVITIES = [
  {
    id: '1',
    type: 'call',
    contact: 'Sarah Chen',
    action: 'Called about 123 Oak Street',
    time: '2 hours ago',
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=3',
  },
  {
    id: '2',
    type: 'meeting',
    contact: 'Michael Torres',
    action: 'Showing scheduled for tomorrow',
    time: '3 hours ago',
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=5',
  },
  {
    id: '3',
    type: 'email',
    contact: 'Emma Wilson',
    action: 'Sent property comparison',
    time: '5 hours ago',
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=20',
  },
  {
    id: '4',
    type: 'note',
    contact: 'James Park',
    action: 'Added note: Prefers modern style',
    time: '1 day ago',
    avatar: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=23',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useAppTheme();

  const currentDate = useMemo(() => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return 'call-outline';
      case 'meeting':
        return 'calendar-outline';
      case 'email':
        return 'mail-outline';
      case 'note':
        return 'create-outline';
      default:
        return 'ellipse-outline';
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
        }}
      >
        {/* Header */}
        <View className="px-5 mb-6">
          <AppText className="text-3xl font-bold text-foreground mb-1">
            {greeting}
          </AppText>
          <AppText className="text-base text-muted">{currentDate}</AppText>
        </View>

        {/* Metrics Cards */}
        <View className="px-5 mb-6">
          <View className="flex-row gap-3">
            {METRICS.map((metric, index) => (
              <Card
                key={metric.label}
                variant="secondary"
                className={cn('flex-1 p-4', index === 1 && 'mx-0')}
              >
                <View className="gap-2">
                  <View
                    className={cn(
                      'size-10 rounded-full items-center justify-center',
                      metric.color
                    )}
                  >
                    <StyledIonicons
                      name={metric.icon as any}
                      size={20}
                      className="text-white"
                    />
                  </View>
                  <AppText className="text-3xl font-bold text-foreground">
                    {metric.value}
                  </AppText>
                  <AppText className="text-xs text-muted">{metric.label}</AppText>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* AI Insight Card */}
        <View className="px-5 mb-6">
          <Card variant="tertiary" className="p-4">
            <View className="flex-row items-start gap-3">
              <View className="size-10 rounded-full bg-purple-500/20 items-center justify-center">
                <StyledIonicons
                  name="sparkles"
                  size={20}
                  className="text-purple-500"
                />
              </View>
              <View className="flex-1">
                <Card.Title className="text-base mb-1">
                  AI Insight
                </Card.Title>
                <Card.Description className="text-sm">
                  Sarah Chen hasn't been contacted in 5 days. Consider following
                  up about the Oak Street property.
                </Card.Description>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-6">
          <AppText className="text-lg font-semibold text-foreground mb-3">
            Quick Actions
          </AppText>
          <View className="flex-row gap-3">
            <Button variant="secondary" className="flex-1">
              <StyledIonicons
                name="add-circle-outline"
                size={18}
                className="text-foreground"
              />
              <Button.Label className="text-sm">Log Activity</Button.Label>
            </Button>
            <Button variant="secondary" className="flex-1">
              <StyledIonicons
                name="person-add-outline"
                size={18}
                className="text-foreground"
              />
              <Button.Label className="text-sm">Add Contact</Button.Label>
            </Button>
            <Button variant="secondary" className="flex-1">
              <StyledIonicons
                name="calendar-outline"
                size={18}
                className="text-foreground"
              />
              <Button.Label className="text-sm">Schedule</Button.Label>
            </Button>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-5">
          <AppText className="text-lg font-semibold text-foreground mb-3">
            Recent Activity
          </AppText>
          <View className="gap-3">
            {RECENT_ACTIVITIES.map((activity) => (
              <Surface key={activity.id} variant="secondary" className="p-4">
                <View className="flex-row items-start gap-3">
                  <Avatar size="md" alt={activity.contact}>
                    <Avatar.Image source={{ uri: activity.avatar }} />
                    <Avatar.Fallback>
                      {activity.contact
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Avatar.Fallback>
                  </Avatar>
                  <View className="flex-1">
                    <AppText className="text-base font-medium text-foreground mb-0.5">
                      {activity.contact}
                    </AppText>
                    <AppText className="text-sm text-muted mb-2">
                      {activity.action}
                    </AppText>
                    <View className="flex-row items-center gap-2">
                      <Chip size="sm" variant="flat">
                        <StyledIonicons
                          name={getActivityIcon(activity.type) as any}
                          size={12}
                          className="text-muted"
                        />
                        <Chip.Label className="text-xs text-muted">
                          {activity.time}
                        </Chip.Label>
                      </Chip>
                    </View>
                  </View>
                </View>
              </Surface>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
