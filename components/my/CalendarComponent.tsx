import { useState } from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
type CalendarProps = {
  startDate: Date | undefined;
  endDate: Date | undefined;

  colorBackground: string;
  colorBackNumber: string;
  colorDot: string;
  colorNumbers: string;
  todayColor: string;
  colorText: string;
  disabledColor: string;
  colorRange: string;
  colorNumberSelected: string;
  onSelected: (dates: [string | undefined, string | undefined]) => boolean;
  onChangeMonth: (m: number) => void;
};
type MarkedDateProps = {
  selected?: boolean;
  selectedColor?: string;
  color?: string;
  selectedDotColor?: string;
  disabled?: boolean;
  marked?: boolean;
  startingDay?: boolean;
  endingDay?: boolean;
};

type MarkedDates = {
  [date: string]: MarkedDateProps;
};

export default function CalendarComponent({
  startDate,
  endDate,
  colorBackground,
  colorBackNumber,
  colorDot,
  colorNumbers,
  onSelected,
  colorText,
  todayColor,
  colorNumberSelected,
  onChangeMonth,
  colorRange,
  disabledColor,
}: CalendarProps) {
  const [selectedStart, setSelectedStart] = useState<string | undefined>("");
  const [selectedEnd, setSelectedEnd] = useState<string | undefined>("");
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [markedDates, setMarkedDates] = useState<{}>({});

  const selectedDates = (start: string, end?: string): MarkedDates => {
    const marks: MarkedDates = {};
    if (!start) {
      return marks;
    }
    if (!end) {
      marks[start] = {
        startingDay: true,
        endingDay: true,
        selected: true,
        selectedColor: colorBackNumber,
        selectedDotColor: colorDot,
      };
      return marks;
    }

    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      const keyDate = currentDate.toISOString().split("T")[0];
      marks[keyDate] = {
        selected: true,
        color: colorRange,
        selectedDotColor: colorDot,
        startingDay: keyDate === start,
        endingDay: keyDate === end,
      };
      currentDate.setDate(currentDate.getDate() + 1); //setto il valore del giorno a quello immediatamente successivo grazie a set e get Date. Es. 15 => 16.
    }

    return marks;
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Calendar
        style={{
          width: "80%",
          aspectRatio: 1,
          marginVertical: 10,
          borderRadius: 20,
          borderWidth: 1,

          borderColor: "gray",

          overflow: "hidden",
        }}
        theme={{
          calendarBackground: colorBackground,
          textSectionTitleColor: colorText,
          selectedDayTextColor: colorNumberSelected,
          todayTextColor: todayColor,
          dayTextColor: colorNumbers,

          textDisabledColor: disabledColor,
        }}
        onDayPress={(day) => {
          //se non esiste la data di inizio la setto e metto quella finale undefined.
          if (!selectedStart) {
            setSelectedStart(day.dateString);
            setSelectedEnd(undefined);
          }
          //se non esiste la data di fine: se la data selezionata è minore di quella di inizio, salviamo la nuova data più piccola, aggiornando invece la data di fine come la precedente iniziale diventata superiore.
          else if (!selectedEnd) {
            if (day.dateString <= selectedStart) {
              setSelectedStart(day.dateString);
              setSelectedEnd(selectedStart);
            } else {
              setSelectedEnd(day.dateString);
            }
            //se è più grande di quella di inzio semplicemente setto quella di fine.
          } else {
            //se entrambe esistono resetto.
            setSelectedStart(day.dateString);
            setSelectedEnd(undefined);
          }
        }}
        markingType="period"
        markedDates={
          //faccio controllo, se esiste una data di inizio si esegue la funzione, altrimenti no.
          selectedStart ? selectedDates(selectedStart, selectedEnd) : {}
        }
      />
    </View>
  );
}
