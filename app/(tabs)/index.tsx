import { useState } from "react";
import { View } from "react-native";
import CalendarComponent from "../../components/my/CalendarComponent";
export default function HomeScreen() {
  const formatISO = (d: Date | undefined) =>
    d ? d.toISOString().split("T")[0] : undefined;

  const startDate: Date | undefined = new Date();
  const formattedStartDate = formatISO(startDate);
  const endDate: Date | undefined = undefined;
  const formattedEndDate = formatISO(endDate);
  const [month, setMonth] = useState<number>(0);

  const colorBack: string = "#fbb5b5ff";
  const colorDot: string = "#6bfaeeff";
  const colorNumber: string = "#d6fd82ff";
  const onSelected = (
    dates: [string | undefined, string | undefined]
  ): boolean => {
    console.log("Dati:", dates);
    return true;
  };
  const onChangeMonth = (m: number): void => {
    setMonth(m);
  };
  return (
    <View>
      <CalendarComponent
        startDate={startDate}
        endDate={endDate}
        colorBack={colorBack}
        colorDot={colorDot}
        colorNumber={colorNumber}
        onSelected={() => onSelected([formattedStartDate, formattedEndDate])}
        onChangeMonth={() => onChangeMonth(month)}
      />
    </View>
  );
}
