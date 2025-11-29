import { useEffect, useState } from "react";
import { Calendar, DateData } from "react-native-calendars";

type MarkedDatesType = {
  [date: string]: any;
};

type CalendarProps = {
  mode: "single" | "range" | "multi";
  onSelectDays: (days: string[]) => void;
  minDate?: Date;
  maxDate?: Date;
  backgroundColor?: string;
};

export default function CCalendar({
  onSelectDays,
  mode,
  minDate,
  maxDate,
  backgroundColor,
}: CalendarProps) {
  const [markedDates, setMarkedDates] = useState<MarkedDatesType>({});

  // al render e al variare di markedDates{date: {selcted: true}, date: {selcted: false}}, esegue la funzione (semplice c.log)
  useEffect(() => {
    //Object.keys, è un metodo degli oggetti che ci restituisce, sottoforma di stringa, il nome-chiave di ogni elemento all'interno del nostro oggetto. (solo primo livello, non annidati come shallow copy)
    const days: string[] = Object.keys(markedDates)
      .filter((date) => markedDates[date].selected)
      //ordinamento, possibile variante pensata: .sort((a, b) => a.localeCompare(b));
      .sort((a, b) => (a < b ? -1 : 1));
    onSelectDays(days);
  }, [markedDates]);

  const onDayPress = (day: DateData) => {
    const selectedDate = day.dateString;

    setMarkedDates((prevMarkedDates) => {
      //prima di tutto assegniamo quelli già "selezionati"
      const newMarkedDates: MarkedDatesType = { ...prevMarkedDates };

      if (
        newMarkedDates[selectedDate] &&
        newMarkedDates[selectedDate].selected
      ) {
        //se è selezionato, in qualsiasi mode lo vogliamo deselezionare.
        delete newMarkedDates[selectedDate];
      } else {
        // Evidenzia il nuovo giorno selezionato
        switch (mode) {
          case "single":
            //svuota ogni volta in quanto singola selezione. Seleziono uno, (seleziono secondo - rimuovo primo)
            Object.keys(newMarkedDates).forEach(
              (date) => delete newMarkedDates[date]
            );
            newMarkedDates[selectedDate] = {
              customStyles: {
                container: { backgroundColor: "orange" },
                text: { color: "white" },
              },
              selected: true,
            };
            break;

          case "multi":
            //tutti i selezionati vanno dentro l'oggetto.
            newMarkedDates[selectedDate] = {
              customStyles: {
                container: { backgroundColor: "orange" },
                text: { color: "white" },
              },
              selected: true,
            };
            break;

          case "range":
            //If select more than two dates, remove all selected dates
            if (
              Object.keys(newMarkedDates).filter(
                (d) => newMarkedDates[d].selected
              ).length > 1
            ) {
              Object.keys(newMarkedDates).forEach(
                (date) => delete newMarkedDates[date] //svuoto l'oggetto
              );
            }

            newMarkedDates[selectedDate] = {
              selected: true,
              color: "orange",
              textColor: "white",
            }; //seleziono il terzo "cliccato", ovviamente come singolo.

            //If select two dates, add starting and ending days
            if (
              Object.keys(newMarkedDates).filter(
                (d) => newMarkedDates[d].selected
              ).length > 1
            ) {
              //ordinamento crescente delle due date.
              const orderedDates = Object.keys(newMarkedDates)
                .filter((d) => newMarkedDates[d].selected)
                .sort((a, b) => (a < b ? -1 : 1));
              //gli attribuisco startingDay come property di native-calendars e ...applico style
              newMarkedDates[orderedDates[0]] = {
                ...newMarkedDates[orderedDates[0]],
                startingDay: true,
              };
              //gli attribuisco endingDay come property di native-calendars e ...applico style
              newMarkedDates[orderedDates[1]] = {
                ...newMarkedDates[orderedDates[1]],
                endingDay: true,
              };

              const diffDateMs =
                //sottrazione dei valori timestamp delle due date per capire l'intervallo tra le due.
                new Date(orderedDates[1]).getTime() -
                new Date(orderedDates[0]).getTime();
              //ms-s-m-h-d
              const days = diffDateMs / 1000 / 60 / 60 / 24;

              for (let i = 1; i < days; i++) {
                //per ogni giorno fino a i < days (così escludo l'ultimo ed il primo), creiamo un nuovo oggetto con nome-chiave la data corretta (ri-convertita da day a ms.toISOString)
                newMarkedDates[
                  new Date(
                    new Date(orderedDates[0]).getTime() +
                      i * 24 * 60 * 60 * 1000
                  )
                    .toISOString()
                    .split("T")[0]
                ] = {
                  color: "orange",
                  textColor: "white",
                };
              }
            }

            break;
        }
      }

      return newMarkedDates;
    });
  };

  return (
    <Calendar
      current={new Date().toISOString().split("T")[0]}
      onDayPress={onDayPress}
      monthFormat="MMMM yyyy"
      hideArrows={false}
      hideExtraDays={true}
      firstDay={1}
      enableSwipeMonths={true}
      markedDates={markedDates}
      markingType={mode === "range" ? "period" : "custom"}
      minDate={minDate ? minDate.toISOString().split("T")[0] : undefined}
      maxDate={maxDate ? maxDate.toISOString().split("T")[0] : undefined}
      style={{
        margin: 20,
        borderRadius: 20,
      }}
      theme={{
        calendarBackground: backgroundColor || "transparent",
        todayTextColor: "blue",
      }}
    />
  );
}
