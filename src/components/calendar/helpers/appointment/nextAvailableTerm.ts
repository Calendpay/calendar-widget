import { ICalendarTermsData } from "../../../../types/calendarTerms.types";
import { isSameDay, isAfter, eachMinuteOfInterval, parseISO } from "date-fns";

import { renderHour } from "./calendarValidDates";

export const getNextAvailableTerm = ({
  workSchedules,
  appointments,
  paymentSessions,
  productId,
  consultationDuration,
  consultationPrepareHours,
}: {
  workSchedules: ICalendarTermsData["workSchedules"];
  appointments: ICalendarTermsData["appointments"];
  paymentSessions: ICalendarTermsData["paymentSessions"];
  productId: string;
  consultationDuration: number;
  consultationPrepareHours: number;
}) => {
  const allWorkSchedulesDays = workSchedules
    .flatMap((workSchedule) => workSchedule.days)
    .filter(
      (day) =>
        (isSameDay(parseISO(day.dateFormat), new Date()) ||
          isAfter(parseISO(day.dateFormat), new Date())) &&
        day?.status === "on"
    );

  // posortować dostępne terminy -> następnie przejść przez nie w pętli i zakończyć pętle gdy znajdzie dostępną godzinę
  const sortedAllWorkSchedulesDays = [...allWorkSchedulesDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  ); //correct

  let availableHour;

  //znajdź najbliższą dostępną godzinę po obecnym dniu
  for (const day of sortedAllWorkSchedulesDays) {
    if (availableHour) break;

    //Sprawdź czy ustawienia dnia mają w products obecny produkt -> jeśli nie -> zwróć dzień jako niedostępny

    const currentProductAvailableInDay = day.products?.find(
      (dayProductId) => dayProductId === productId
    );

    if (!currentProductAvailableInDay) continue;

    //Sprawdź czy dzień ma ustawioną hourStart i hourEnd -> jeśli nie -> zwróć dzień jako niedostępny
    if (!day.hourStart || !day.hourEnd) continue;

    //Zrób dayHours z godziny rozpoczęcia i zakończenia z interwałem uwzględnionym w ustawieniach dnia
    const availableHoursArray = eachMinuteOfInterval(
      {
        start: day.hourStart,
        end: day.hourEnd,
      },
      {
        step: day.displayHourStepMinutes || 15,
      }
    );

    //correct

    // dla każdej godziny w przedziale sprawdzić czy jest po obecnej dacie, czy nie jest wyjątkiem, czy nie jest zarezerwowana
    for (const hour of availableHoursArray) {
      const hourStatus = renderHour(
        {
          hour,
          productDuration: consultationDuration,
          productPrepareHours: consultationPrepareHours,
          dayHourEnd: day.hourEnd as Date,
          dayExceptions: day.exceptions,
          paymentSessions,
          appointments,
        }

        // availableTerms,
        // appointments,
        // paymentSessions,
      ); //available //unavailableTerm // unAvalilableException // appointmentReserved //appointmentConfirmed

      if (hourStatus === "available") {
        availableHour = new Date(hour);
        break;
      } //correct
    }
  }

  return availableHour;
};
