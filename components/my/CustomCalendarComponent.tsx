import React, {useEffect, useState} from 'react';
import {Calendar, DateData} from 'react-native-calendars';
import {useTheme} from "@react-navigation/core";

type MarkedDatesType = {
    [date: string]: any;
};

type CalendarProps = {
    mode: 'single' | 'range' | 'multi',
    onSelectDays: (days: string[]) => void;
    minDate?: Date;
    maxDate?: Date;
    backgroundColor?: string;
}

export default function CCalendar({onSelectDays, mode, minDate, maxDate, backgroundColor}: CalendarProps) {
    const [markedDates, setMarkedDates] = useState<MarkedDatesType>({});

    useEffect(() => {
        const days: string[] = Object.keys(markedDates).filter(date => markedDates[date].selected).sort((a, b) => a < b ? -1 : 1);
        onSelectDays(days)
    }, [markedDates]);

    const onDayPress = (day: DateData) => {
        const selectedDate = day.dateString;

        setMarkedDates((prevMarkedDates) => {
            const newMarkedDates: MarkedDatesType = {...prevMarkedDates};

            if (newMarkedDates[selectedDate] && newMarkedDates[selectedDate].selected) {
                delete newMarkedDates[selectedDate];
            } else {
                // Evidenzia il nuovo giorno selezionato
                switch (mode) {
                    case "single":
                        Object.keys(newMarkedDates).forEach(date => delete newMarkedDates[date]);
                        newMarkedDates[selectedDate] = {
                            customStyles: {
                                container: {backgroundColor: 'orange'},
                                text: {color: 'white'},
                            },
                            selected: true
                        };
                        break

                    case 'multi':
                        newMarkedDates[selectedDate] = {
                            customStyles: {
                                container: {backgroundColor: 'orange'},
                                text: {color: 'white'},
                            },
                            selected: true
                        };
                        break

                    case 'range':
                        //If select more than two dates, remove all selected dates
                        if (Object.keys(newMarkedDates).filter(d => newMarkedDates[d].selected).length > 1) {
                            Object.keys(newMarkedDates).forEach(date => delete newMarkedDates[date]);
                        }

                        newMarkedDates[selectedDate] = {
                            selected: true,
                            color: 'orange',
                            textColor: 'white',
                        };

                        //If select two dates, add starting and ending days
                        if (Object.keys(newMarkedDates).filter(d => newMarkedDates[d].selected).length > 1) {

                            const orderedDates = Object.keys(newMarkedDates).filter(d => newMarkedDates[d].selected).sort((a, b) => a < b ? -1 : 1)

                            newMarkedDates[orderedDates[0]] = {
                                ...newMarkedDates[orderedDates[0]],
                                startingDay: true
                            }
                            newMarkedDates[orderedDates[1]] = {
                                ...newMarkedDates[orderedDates[1]],
                                endingDay: true
                            }

                            const diffDateMs = new Date(orderedDates[1]).getTime() - new Date(orderedDates[0]).getTime()
                            const days = diffDateMs / 1000 / 60 / 60 / 24

                            for (let i = 1; i < days; i++) {
                                newMarkedDates[new Date(new Date(orderedDates[0]).getTime() + (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]] = {
                                    color: 'orange',
                                    textColor: 'white',
                                }
                            }
                        }

                        break
                }
            }

            return newMarkedDates
        });
    };

    return (
        <Calendar
            current={new Date().toISOString().split('T')[0]}
            onDayPress={onDayPress}
            monthFormat="MMMM yyyy"
            hideArrows={false}
            hideExtraDays={true}
            firstDay={1}
            enableSwipeMonths={true}
            markedDates={markedDates}
            markingType={mode === 'range' ? "period" : "custom"}
            minDate={minDate ? minDate.toISOString().split('T')[0] : undefined}
            maxDate={maxDate ? maxDate.toISOString().split('T')[0] : undefined}
            style={{
                margin: 20,
                borderRadius: 20
            }}
            theme={{
                calendarBackground: backgroundColor || 'transparent',
                todayTextColor: 'blue'
            }}
        />
    );
}
