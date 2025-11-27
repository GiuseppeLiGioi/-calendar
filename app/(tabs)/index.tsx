import CalendarComponent from "@/components/my/CalendarComponent";
import { useState } from "react";
import { View } from "react-native";
export default function HomeScreen() {
  const formatISO = (d: Date | undefined) =>
    d ? d.toISOString().split("T")[0] : undefined;

  const startDate: Date | undefined = new Date();
  const formattedStartDate = formatISO(startDate);
  const endDate: Date | undefined = undefined;
  const formattedEndDate = formatISO(endDate);
  const [month, setMonth] = useState<number>(0);

  const colorBackground: string = "#fbb5b5ff"; //colore di sfondo calendario
  const colorBackNumber: string = "#7ac3ffff"; //colore di sfondo numero del giorno
  const colorDot: string = "#6bfaeeff"; //colore di pallino giorno selezionato
  const colorNumbers: string = "#d6fd82ff"; //colore dei numeri
  const colorNumberSelected: string = "#fd0505ff"; //colore del numero selezionato
  const colorText: string = "#10a529ff"; //colore dei testi
  const todayColor: string = "#f505e9ff"; //colore data di oggi
  const colorRange: string = "#3fb9f1ff";
  const disabledColor: string = "rgba(126, 126, 126, 0.4)"; //colore numeri non selezionabili
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CalendarComponent
        startDate={startDate}
        endDate={endDate}
        colorBackground={colorBackground}
        colorBackNumber={colorBackNumber}
        colorDot={colorDot}
        colorText={colorText}
        todayColor={todayColor}
        colorNumbers={colorNumbers}
        disabledColor={disabledColor}
        colorRange={colorRange}
        colorNumberSelected={colorNumberSelected}
        onSelected={onSelected}
        onChangeMonth={onChangeMonth}
      />
    </View>
  );
}
