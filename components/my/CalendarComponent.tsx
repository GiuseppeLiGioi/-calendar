import { Text, View } from "react-native";

type CalendarProps = {
  startDate: Date | undefined;
  endDate: Date | undefined;

  colorBack: string;
  colorDot: string;
  colorNumber: string;
  onSelected: () => boolean;
  onChangeMonth: () => void;
};
export default function Calendar({
  startDate,
  endDate,
  colorBack,
  colorDot,
  colorNumber,
  onSelected,
  onChangeMonth,
}: CalendarProps) {
  return (
    <View>
      <Text>Calendar</Text>
    </View>
  );
}
