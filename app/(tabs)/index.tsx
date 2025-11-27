import CalendarComponent from "@/components/my/CalendarComponent";
import { View } from "react-native";
export default function HomeScreen() {
  // Sfondo del calendario
  const colorBackground: string = "#ffffffff";

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
  // Colore dei bordi del calendario
  const borderColor: string = "gray";

  return (
    <>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CalendarComponent
          colorBackground={colorBackground}
          colorText={colorText}
          todayColor={todayColor}
          borderColor={borderColor}
          colorNumbers={colorNumbers}
          disabledColor={disabledColor}
          colorRange={colorRange}
          colorNumberSelected={colorNumberSelected}
        />
      </View>
    </>
  );
}
