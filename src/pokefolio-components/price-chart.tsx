import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useAppTheme } from '../contexts/app-theme-context';
import { AppText } from '../components/app-text';

export type PriceDataPoint = {
  date: string;
  price: number;
};

export type PriceChartProps = {
  data: PriceDataPoint[];
  width?: number;
  height?: number;
};

export function PriceChart({ data, width = 300, height = 180 }: PriceChartProps) {
  const { isDark } = useAppTheme();

  // Transform data for gifted-charts
  const chartData = data.map((point) => ({
    value: point.price,
    label: point.date,
    labelComponent: () => (
      <AppText className="text-xs text-muted" style={{ width: 50, textAlign: 'center' }}>
        {point.date}
      </AppText>
    ),
  }));

  const lineColor = isDark ? '#3B82F6' : '#2563EB';
  const gradientStartColor = isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.4)';
  const gradientEndColor = isDark ? 'rgba(59, 130, 246, 0.0)' : 'rgba(37, 99, 235, 0.0)';

  return (
    <View>
      <LineChart
        data={chartData}
        width={width - 40}
        height={height}
        curved
        areaChart
        hideDataPoints={false}
        spacing={width / data.length}
        color={lineColor}
        thickness={3}
        startFillColor={gradientStartColor}
        endFillColor={gradientEndColor}
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={10}
        noOfSections={4}
        yAxisColor={isDark ? '#374151' : '#E5E7EB'}
        xAxisColor={isDark ? '#374151' : '#E5E7EB'}
        yAxisTextStyle={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
        xAxisLabelTextStyle={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
        showVerticalLines
        verticalLinesColor={isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.5)'}
        rulesColor={isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.5)'}
        rulesType="solid"
        yAxisLabelPrefix="$"
        pointerConfig={{
          pointerStripHeight: height,
          pointerStripColor: isDark ? '#374151' : '#E5E7EB',
          pointerStripWidth: 2,
          pointerColor: lineColor,
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 90,
          activatePointersOnLongPress: false,
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: (items: any) => {
            return (
              <View
                style={{
                  height: 90,
                  width: 100,
                  justifyContent: 'center',
                  marginTop: -30,
                  marginLeft: -40,
                }}
              >
                <View
                  className={isDark ? 'bg-neutral-800' : 'bg-white'}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <AppText className="text-xs text-muted mb-1">
                    {items[0].label}
                  </AppText>
                  <AppText className="text-lg font-bold text-foreground">
                    ${items[0].value.toFixed(2)}
                  </AppText>
                </View>
              </View>
            );
          },
        }}
      />
    </View>
  );
}
