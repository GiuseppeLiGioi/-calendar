import CalendarComponent from "@/components/my/CalendarComponent";
import { useState } from "react";
import { View } from "react-native";
export default function HomeScreen() {
  const [month, setMonth] = useState<number>(0);

  // Sfondo del calendario
  const colorBackground: string = "#ffffff";

  // Sfondo dei numeri selezionati (giorni cliccati)
  const colorBackNumber: string = "#4caf50";

  // Pallino dei giorni con eventi o selezionati
  const colorDot: string = "#ff9800";

  // Colore dei numeri dei giorni normali
  const colorNumbers: string = "#212121";

  // Colore del numero del giorno selezionato
  const colorNumberSelected: string = "#ade8ffff";

  // Colore dei titoli delle sezioni (giorni della settimana)
  const colorText: string = "#616161";

  // Colore della data odierna
  const todayColor: string = "#2196f3";

  // Colore del range selezionato
  const colorRange: string = "#dcaafdff";

  // Colore dei numeri non selezionabili/disabilitati
  const disabledColor: string = "rgba(189, 189, 189, 0.5)";

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
