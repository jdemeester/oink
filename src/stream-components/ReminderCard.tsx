import { Ionicons } from '@expo/vector-icons';
import { Button, Chip, Surface } from 'heroui-native';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';
import { AppText } from '../components/app-text';

const StyledIonicons = withUniwind(Ionicons);

type ReminderCardProps = {
  id: string;
  title: string;
  dueTime?: string;
  metadata?: string;
  suggestion?: string;
  isCompleted: boolean;
  onComplete: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function ReminderCard({
  id,
  title,
  dueTime,
  metadata,
  suggestion,
  isCompleted,
  onComplete,
  onEdit,
  onDelete,
}: ReminderCardProps) {
  return (
    <Surface variant="secondary" className="p-4 mb-3">
      <View className="gap-3">
        {/* Header */}
        <View className="flex-row items-start gap-3">
          <View
            className={`w-5 h-5 rounded-full border-2 items-center justify-center mt-0.5 ${
              isCompleted
                ? 'bg-success border-success'
                : 'border-muted'
            }`}
          >
            {isCompleted && (
              <StyledIonicons
                name="checkmark"
                size={12}
                className="text-white"
              />
            )}
          </View>
          <View className="flex-1">
            <AppText
              className={`text-base font-semibold ${
                isCompleted
                  ? 'text-muted line-through'
                  : 'text-foreground'
              }`}
            >
              {title}
            </AppText>
            {metadata && (
              <AppText className="text-sm text-muted mt-1">
                {metadata}
              </AppText>
            )}
            {dueTime && (
              <View className="flex-row items-center gap-1 mt-2">
                <StyledIonicons
                  name="time-outline"
                  size={14}
                  className="text-muted"
                />
                <AppText className="text-xs text-muted">
                  Due: {dueTime}
                </AppText>
              </View>
            )}
          </View>
        </View>

        {/* Smart Suggestion */}
        {suggestion && !isCompleted && (
          <View className="bg-accent/10 px-3 py-2 rounded-lg">
            <View className="flex-row items-start gap-2">
              <StyledIonicons
                name="bulb-outline"
                size={16}
                className="text-accent mt-0.5"
              />
              <AppText className="text-sm text-accent flex-1">
                {suggestion}
              </AppText>
            </View>
          </View>
        )}

        {/* Actions */}
        <View className="flex-row items-center gap-2">
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            size="sm"
            onPress={() => onComplete(id)}
          >
            <StyledIonicons
              name={isCompleted ? 'refresh-outline' : 'checkmark'}
              size={16}
              className={isCompleted ? 'text-foreground' : 'text-white'}
            />
            <Button.Label>
              {isCompleted ? 'Undo' : 'Mark done'}
            </Button.Label>
          </Button>
          {onEdit && (
            <Button variant="ghost" size="sm" onPress={() => onEdit(id)}>
              <Button.Label>Edit</Button.Label>
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onPress={() => onDelete(id)}>
              <Button.Label className="text-danger">Delete</Button.Label>
            </Button>
          )}
        </View>
      </View>
    </Surface>
  );
}
