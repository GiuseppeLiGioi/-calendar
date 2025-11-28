import { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
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

  customStyles?: {
    container?: object;
    text?: object;
  };
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
}: CalendarProps) {
  const [selectedStart, setSelectedStart] = useState<string | undefined>("");
  const [selectedEnd, setSelectedEnd] = useState<string | undefined>("");
  const [containerSize, setContainerSize] = useState<number>(0);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);

  const calendarSize = Math.max(containerSize * 0.9, 320);
  const effectiveHeight =
    Platform.OS === "web" ? containerSize * 0.6 : containerSize;

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

  function getMarginBottom(size: number): number {
    let marginBottom = 0;

    if (Platform.OS === "web") {
      // valori web
      if (size <= 200) {
        marginBottom = size * 0.9;
      } else if (size <= 300) {
        marginBottom = size * 0.6;
      } else if (size <= 500) {
        marginBottom = size * 0.3;
      } else if (size <= 600) {
        marginBottom = size * 0.1;
      } else if (size <= 750) {
        marginBottom = size * 0.02;
      } else {
        marginBottom = size * 0.01;
      }
    } else {
      //valori mobile
      if (size <= 300) {
        marginBottom = size * 0.4;
      } else if (size <= 500) {
        marginBottom = size * 0.02;
      } else {
        marginBottom = size * 0.01;
      }
    }

    return marginBottom;
  }

  //funzione per trasformare da YYYY-MM-DD a DD-MM-YYYY
  const formatDate = (date?: string): string => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  //funzione per trasformare il range in singoli giorni
  const generateRange = (start: string, end: string): string[] => {
    const result: string[] = [];
    let first: Date = new Date(start);
    let last: Date = new Date(end);

    if (first > last) [first, last] = [last, first];

    while (first <= last) {
      const string = first.toISOString().split("T")[0];
      result.push(string);
      first.setDate(first.getDate() + 1);
    }
    return result;
  };

  const multiMarks = (dates: string[]): MarkedDates => {
    const marks: MarkedDates = {};

    dates.forEach((date) => {
      marks[date] = {
        customStyles: {
          container: {
            backgroundColor: colorRange,
            borderRadius: 50,
          },
          text: {
            color: colorNumberSelected,
            fontWeight: "bold",
          },
        },
      };
    });

    return marks;
  };

  console.log(containerSize);
  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerSize(width);
      }}
    >
      <View
        style={[
          styles.innerContainer,
          {
            width: calendarSize,
            height: effectiveHeight,

            marginBottom: getMarginBottom(containerSize),
          },
          Platform.OS === "web"
            ? { height: containerSize * 0.6 }
            : { aspectRatio: 1 },
        ]}
      >
        <Calendar
          style={{
            width: calendarSize,

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

            textDayFontSize:
              containerSize > 600 ? calendarSize * 0.02 : calendarSize * 0.065,
            textDayHeaderFontSize:
              containerSize > 600 ? calendarSize * 0.3 : calendarSize * 0.045,
            textMonthFontSize:
              containerSize > 600 ? calendarSize * 0.5 : calendarSize * 0.065,

            weekVerticalMargin: calendarSize * 0.01,
          }}
          onDayPress={(day) => {
            const date = day.dateString;
            //multiSelected all'inizio è vuoto, posso fare controllo anche qui in alto, toggle giorno singolo.
            if (multiSelected.length > 0) {
              const newList = multiSelected.includes(date)
                ? multiSelected.filter((d) => d !== date)
                : [...multiSelected, date];

              setMultiSelected(newList);
              return;
            }

            //se non esiste la data di inizio la setto e metto quella finale undefined.
            if (!selectedStart && multiSelected.length === 0) {
              setSelectedStart(date);
              setSelectedEnd(undefined);
              setMultiSelected([]);
              return;
            } else if (
              selectedStart &&
              !selectedEnd &&
              multiSelected.length === 0
            ) {
              if (date === selectedStart) return; // evita che si possa inserire lo stesso giorno sia come start che come end.
              if (date < selectedStart) {
                setSelectedEnd(selectedStart);
                setSelectedStart(date);
              } else {
                setSelectedEnd(date);
              }
              return;
            }

            //Range già selezionato passo alla multiSelezione, definisco il range.
            if (selectedStart && selectedEnd) {
              const newRange = generateRange(selectedStart, selectedEnd);
              setMultiSelected(newRange);

              setSelectedStart(undefined);
              setSelectedEnd(undefined);
              return;
            }
          }}
          markingType={multiSelected.length > 0 ? "custom" : "period"}
          markedDates={(() => {
            //se ci sono giorni nella lista, chiamo la funzione ed applico ad ognuno le prop calendar style
            if (multiSelected.length > 0) {
              return multiMarks(multiSelected);
            }

            // per il giorno singolo o range chiamo la funzione e setto acnhe qua le calendar prop style
            if (selectedStart) {
              return selectedDates(selectedStart, selectedEnd);
            }
            return {};
          })()}
        />
      </View>

      {multiSelected.length > 0 ? (
        <View
          style={[
            styles.bottomContainer,
            { maxWidth: calendarSize, marginTop: containerSize * 0.2 },
          ]}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: containerSize * 0.045,
            }}
          >
            {multiSelected.join(" - ")}
          </Text>
        </View>
      ) : (
        (selectedStart || selectedEnd) && (
          <View
            style={[
              styles.bottomContainer,
              {
                maxWidth: calendarSize,
                marginTop: containerSize * 0.1,
              },
            ]}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: containerSize * 0.05,
                marginTop: containerSize * 0.15,
              }}
            >
              {formatDate(selectedStart)}
              {" - "}
              {formatDate(selectedEnd)}
            </Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 800, // per non avere calendario troppo stretchato
    justifyContent: "space-between",
    alignItems: "center",
  },

  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
  },

  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
