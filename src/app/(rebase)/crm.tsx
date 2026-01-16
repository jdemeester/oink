import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/app-text';

export default function CRMScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background items-center justify-center"
      style={{ paddingTop: insets.top }}
    >
      <AppText className="text-2xl font-bold text-foreground">CRM</AppText>
      <AppText className="text-base text-muted mt-2">
        Manage your contacts and deals
      </AppText>
    </View>
  );
}
