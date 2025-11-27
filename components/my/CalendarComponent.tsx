import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

type CalendarProps = {
  colorBackground: string;

  colorNumbers: string;
  todayColor: string;
  colorText: string;
  disabledColor: string;
  borderColor: string;
  colorRange: string;
  colorNumberSelected: string;
  customStyle: boolean;
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
  colorBackground,
  colorNumbers,
  colorText,
  todayColor,
  colorNumberSelected,
  borderColor,
  colorRange,
  disabledColor,
  customStyle,
}: CalendarProps) {
  const [selectedStart, setSelectedStart] = useState<string | undefined>("");
  const [selectedEnd, setSelectedEnd] = useState<string | undefined>("");
  const [containerSize, setContainerSize] = useState<number>(0);
  const [markedDates, setMarkedDates] = useState<{}>({});

  const calendarSize = Math.max(containerSize * 0.9, 320);

  const selectedDates = (start: string, end?: string): MarkedDates => {
    //creo un oggeto marks che conterrà ciascun giorno con le sue proprietà
    const marks: MarkedDates = {};
    //se start non esiste ritorno oggetto vuoto.
    if (!start) {
      return marks;
    }
    // se non c'è la data di fine, ritorno il singolo oggetto e gli attribuisco le proprietà
    if (!end) {
      marks[start] = {
        startingDay: true,
        endingDay: true,
        marked: false,
        selected: true,
        color: colorRange,
      };
      return marks;
    }
    // se sono presenti entrambi, mi salvo i valori e ciclo fin tanto che la data di fine è <= a quella di inizio, in modo da selezionare tutti gli elementi.
    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      //per ogni elemento converto in stringa ISO, setto le proprietà dell' elemento e poi incremento di 1, in modo da far passare il ciclo al giorno usccessivo.
      const keyDate = currentDate.toISOString().split("T")[0];
      //per tutti i giorni (keyDate) fino a <= di endDate verrà eseguito questo codice, markando così ogni giorno (range).
      marks[keyDate] = {
        selected: true,
        color: colorRange,
        startingDay: keyDate === start,
        endingDay: keyDate === end,
      };
      currentDate.setDate(currentDate.getDate() + 1); //setto il valore del giorno a quello immediatamente successivo grazie a set e get Date. Es. 15 => 16.
    }

    return marks;
  };

  //funzione per trasformare da YYYY-MM-DD a DD-MM-YYYY
  const formatDate = (date?: string): string => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };
  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        const newSize = Math.min(width, height, 450);
        if (newSize !== containerSize) setContainerSize(newSize);
        console.log(newSize);
      }}
    >
      <View style={styles.innerContainer}>
        <Calendar
          style={{
            minWidth: calendarSize,
            aspectRatio: 1,
            padding: calendarSize * 0.04,
            marginVertical: calendarSize * 0.05,
            borderRadius: calendarSize * 0.1,
            borderWidth: calendarSize * 0.005,
            borderColor: borderColor,

            overflow: "hidden",
          }}
          theme={{
            calendarBackground: colorBackground,
            textSectionTitleColor: colorText,
            selectedDayTextColor: colorNumberSelected,
            todayTextColor: todayColor,
            dayTextColor: colorNumbers,
            textDisabledColor: disabledColor,

            textDayFontSize: calendarSize * 0.065,
            textDayHeaderFontSize: calendarSize * 0.045,
            textMonthFontSize: calendarSize * 0.065,

            weekVerticalMargin: calendarSize * 0.01,
          }}
          onDayPress={(day) => {
            let newStart = selectedStart;
            let newEnd = selectedEnd;

            //se non esiste la data di inizio la setto e metto quella finale undefined.
            if (!selectedStart) {
              newStart = day.dateString;
              newEnd = undefined;
            } else if (!selectedEnd) {
              if (day.dateString === selectedStart) return; // evita che si possa inserire lo stesso giorno sia come start che come end.
              if (day.dateString <= selectedStart) {
                //se la seconda data scelta è inferiore della prima, invertiamo i valori, la prima sarà la finale.
                newStart = day.dateString;
                newEnd = selectedStart;
              } else {
                //se invece è maggiore semplicemente la setto come finale.
                newEnd = day.dateString;
              }
            } else {
              // else reset
              newStart = day.dateString;
              newEnd = undefined;
            }
            // sincronizzo gli stati con valori aggiornati e corretti
            setSelectedStart(newStart);
            setSelectedEnd(newEnd);
            //salvo in un nuovo oggetto, perche la funzione vuole un obj
            const newMarks = { newStart, newEnd };
            //sincronizzo lo stato del range e passo i valori alla funzione chiamante da home.
            setMarkedDates(newMarks);
          }}
          markingType="period"
          markedDates={
            //faccio controllo, se esiste una data di inizio si esegue la funzione, altrimenti no.
            selectedStart ? selectedDates(selectedStart, selectedEnd) : {}
          }
        />
      </View>

      {(selectedStart || selectedEnd) && customStyle === true && (
        <View style={styles.customContainer}>
          <Text
            style={{
              textAlign: "center",
              fontSize: containerSize * 0.05,
              marginTop: containerSize * 0.01,
            }}
          >
            {formatDate(selectedStart)}
            {"   "}-{"   "}
            {formatDate(selectedEnd)}
          </Text>
        </View>
      )}

      {(selectedStart || selectedEnd) && customStyle === false && (
        <Text
          style={{
            textAlign: "center",
            fontSize: containerSize * 0.05,
            marginTop: containerSize * 0.01,
          }}
        >
          {formatDate(selectedStart)}
          {"   "}-{"   "}
          {formatDate(selectedEnd)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  innerContainer: {
    maxWidth: "80%",
    aspectRatio: 1,
    alignItems: "center",
  },

  customContainer: {
    width: "80%",
    borderWidth: 2,
    borderColor: "#f08383ff",
  },
});
