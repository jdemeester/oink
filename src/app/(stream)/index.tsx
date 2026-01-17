import { Ionicons } from '@expo/vector-icons';
import { Button, TextField } from 'heroui-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../components/app-text';
import { MessageBubble } from '../../stream-components/MessageBubble';
import { ReminderCard } from '../../stream-components/ReminderCard';

const StyledIonicons = withUniwind(Ionicons);

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

type Reminder = {
  id: string;
  title: string;
  dueTime?: string;
  metadata?: string;
  suggestion?: string;
  isCompleted: boolean;
};

// Mock data for demo
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Add these to my calendar: Coffee with Steve tomorrow 9am, Intel call Friday 2pm, date night Saturday 7pm',
    isUser: true,
  },
  {
    id: '2',
    content: 'I\'ve created 3 reminders for you. Tap to mark them done or edit them.',
    isUser: false,
  },
];

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Coffee with Steve',
    dueTime: 'Thu, Jan 16 • 9:00 AM',
    metadata: '📍 Want to add Stovetop location?',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Intel Call',
    dueTime: 'Fri, Jan 17 • 2:00 PM',
    suggestion: 'Conflicts with Team standup (1:30-2:30 PM)',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Date Night',
    dueTime: 'Sat, Jan 18 • 7:00 PM',
    suggestion: 'Jess is free. Suggest restaurants?',
    isCompleted: false,
  },
];

export default function StreamScreen() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);

  const handleSend = () => {
    if (message.trim()) {
      // For now, just echo the message
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        isUser: true,
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // TODO: Send to Claude API
      console.log('Sending:', message);
    }
  };

  const handleCompleteReminder = (id: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
      )
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="px-5 py-4 border-b border-border">
          <AppText className="text-2xl font-bold text-foreground">Stream</AppText>
          <AppText className="text-sm text-muted mt-1">
            Chat with your life. Act on the cards.
          </AppText>
        </View>

        {/* Cards Area - ScrollView for messages and interactive cards */}
        <ScrollView className="flex-1 px-5 py-4">
          {messages.length === 0 && reminders.length === 0 ? (
            /* Empty state */
            <View className="flex-1 items-center justify-center py-20">
              <StyledIonicons
                name="chatbubble-outline"
                size={64}
                className="text-muted mb-4"
              />
              <AppText className="text-lg font-semibold text-foreground mb-2">
                Start a conversation
              </AppText>
              <AppText className="text-sm text-muted text-center max-w-xs">
                Ask me to create reminders, check your calendar, or manage your day
              </AppText>
            </View>
          ) : (
            <View className="gap-4">
              {/* Messages */}
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  content={msg.content}
                  isUser={msg.isUser}
                />
              ))}

              {/* Reminder Cards */}
              {reminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  id={reminder.id}
                  title={reminder.title}
                  dueTime={reminder.dueTime}
                  metadata={reminder.metadata}
                  suggestion={reminder.suggestion}
                  isCompleted={reminder.isCompleted}
                  onComplete={handleCompleteReminder}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Chat Input - Fixed at bottom */}
        <View
          className="border-t border-border bg-background px-5"
          style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
        >
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <TextField>
                <TextField.Input
                  placeholder="Message Stream..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={500}
                  className="max-h-32"
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
                />
              </TextField>
            </View>
            <Button
              variant="primary"
              size="md"
              isIconOnly
              onPress={handleSend}
              className={message.trim() ? '' : 'opacity-50'}
            >
              <StyledIonicons
                name="arrow-up"
                size={20}
                className="text-white"
              />
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
