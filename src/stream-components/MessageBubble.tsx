import { View } from 'react-native';
import { AppText } from '../components/app-text';

type MessageBubbleProps = {
  content: string;
  isUser: boolean;
};

export function MessageBubble({ content, isUser }: MessageBubbleProps) {
  return (
    <View
      className={`mb-3 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <View
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-accent rounded-br-sm'
            : 'bg-secondary rounded-bl-sm'
        }`}
      >
        <AppText
          className={`text-sm ${
            isUser ? 'text-white' : 'text-foreground'
          }`}
        >
          {content}
        </AppText>
      </View>
    </View>
  );
}
