import { ICalendarTermsData } from "../../../../types/calendarTerms.types";
import {
  eachMinuteOfInterval,
  isAfter,
  addHours,
  isSameDay,
  addMinutes,
  isBefore,
  isEqual,
  parseISO,
} from "date-fns";
import { currentDateReservationSessionCheck } from "./reservationSessionValidation/reservationSessionValidation";
import { currentDateAppointmentsCheck } from "./reservationSessionValidation/appointmentValidation";

export type HourStatus =
  | "available"
  | "unAvailable"
  | "unAvailableException"
  | "appointmentReserved"
  | "appointmentConfirmed";

export interface ICalendarVaildDay {
  dayKey: string;
  day: Date;
  hours:
    | {
        hourKey: string;
        hour: Date;
        hourStatus: HourStatus;
      }[]
    | [];
}

interface ICalendarVaildDatesProps {
  days: Date[];
  workSchedules: ICalendarTermsData["workSchedules"];
  productId: string;
  productDuration: number;
  productPrepareHours: number;
  appointments: ICalendarTermsData["appointments"];
  paymentSessions: ICalendarTermsData["paymentSessions"];
}

export const calendarValidDates = ({
  days,
  paymentSessions,
  workSchedules,
  productId,
  productDuration,
  productPrepareHours,
  appointments,
}: ICalendarVaildDatesProps): ICalendarVaildDay[] => {
  //1. Pobierz dostępne terminy na obecny i przyszły tydzień
  //2. Dla 5 dni kalendarza znajdź dzien w złączonych workSchedules.concat[] -> jeśli nie -> zwróć dzień jako niedostępny
  //3. Sprawdź czy ustawienia dnia mają w products obecny produkt -> jeśli nie -> zwróć dzień jako niedostępny
  //4. Znajdź w ustawieniach dnia co ile minut wyświetlać dostępne godziny np. 5,10,15,30 (displayHourStepMinutes) -> jeśli nie -> zwróć dzień jako niedostępny
  //5. Sprawdź czy dzień ma ustawioną hourStart i hourEnd -> jeśli nie -> zwróć dzień jako niedostępny
  //6. Zrób dayHours z godziny rozpoczęcia i zakończenia z interwałem uwzględnionym w ustawieniach dnia
  //7. Dla każdej godziny np. 8.00,8.10 (zależy jaki przedział) sprawdź czy:
  //7.1  - nie znajduje się w czasie product.prepareHours -> godzina od obecnej godziny np. czas przygotowania 12h.
  //7.1  - nie jest zawarta w przerwie dnia (exceptions.concat)
  //7.2  - nie znajduję się w czasie przed przerwą np. usługa trwa 60 min, a przerwa zaczyna się o 13.20, to ostatnia możliwa godzina to 12.20
  //7.3  - nie znajduję się w czasie przed zakończeniem godzin pracy np. usługa trwa 60 min, a dzień konczy sie o 18.45, to ostatnia możliwa godzina to 17.45
  //7.4  - appointment validation - data z godziną nie jest już zarezerwowana, lub nie znajduje się przed rozpoczeciem spotkania - || -
  //7.4  - payment session validation - data z godziną nie jest już zarezerwowana w sesji 30 min dla sesji po obecnej dacie, lub nie znajduje się przed rozpoczeciem rezerwacji - || -

  //znajdź dzień w workSchedules
  const allWorkSchedulesDays = workSchedules.flatMap(
    (workSchedule) => workSchedule.days
  );

  const dates = days.map((day, dayIndex) => {
    const dayKey = dayIndex + 1 + "dd";

    //1/2 znajdź dzień w workSchedules
    const currentDayInWorkSchedule = allWorkSchedulesDays.find(
      (workScheduleDay) => isSameDay(day, parseISO(workScheduleDay.dateFormat))
    );

    if (
      !currentDayInWorkSchedule ||
      currentDayInWorkSchedule?.status !== "on"
    ) {
      return {
        dayKey,
        day,
        hours: [],
      };
    }

    //3. Sprawdź czy ustawienia dnia mają w products obecny produkt -> jeśli nie -> zwróć dzień jako niedostępny
    const currentProductAvailableInDay =
      currentDayInWorkSchedule.products?.find(
        (dayProductId) => dayProductId === productId
      );

    if (!currentProductAvailableInDay) {
      return {
        dayKey,
        day,
        hours: [],
      };
    }

    //4. Znajdź w ustawieniach dnia co ile minut wyświetlać dostępne godziny np. 5,10,15,30 (day.displayHourStepMinutes) -> jeśli nie -> zwróć dzień jako niedostępny
    //5. Sprawdź czy dzień ma ustawioną hourStart i hourEnd -> jeśli nie -> zwróć dzień jako niedostępny
    if (
      !currentDayInWorkSchedule.hourStart ||
      !currentDayInWorkSchedule.hourEnd
    ) {
      return {
        dayKey,
        day,
        hours: [],
      };
    }

    //6. Zrób dayHours z godziny rozpoczęcia i zakończenia z interwałem uwzględnionym w ustawieniach dnia
    const dayHours = availableHoursRange({
      hourStart: currentDayInWorkSchedule.hourStart,
      hourEnd: currentDayInWorkSchedule.hourEnd,
      displayHourStepMinutes: currentDayInWorkSchedule.displayHourStepMinutes,
    });

    const dayHoursRender = dayHours.map((hour, hourIndex) => {
      const hourKey = hourIndex + 1 + "hh";

      //7. Dla każdej godziny np. 8.00,8.10 (zależy jaki przedział) sprawdź czy:

      const hourStatus = renderHour({
        hour,
        productDuration,
        productPrepareHours,
        dayHourEnd: currentDayInWorkSchedule.hourEnd as Date,
        dayExceptions: currentDayInWorkSchedule.exceptions,
        paymentSessions,
        appointments,
      }) as HourStatus; //available //unavailableTerm // unAvalilableException // appointmentReserved //appointmentConfirmed

      //hour
      return {
        hourKey,
        hour,
        hourStatus,
      };
    });

    //day
    return {
      dayKey,
      day,
      hours: dayHoursRender,
    };
  });

  //days
  return dates;
};

const availableHoursRange = ({
  hourStart,
  hourEnd,
  displayHourStepMinutes,
}: {
  hourStart: Date;
  hourEnd: Date;
  displayHourStepMinutes?: number;
}) => {
  const availableHoursArray = eachMinuteOfInterval(
    {
      start: hourStart,
      end: hourEnd,
    },
    {
      step: displayHourStepMinutes || 15,
    }
  );

  //correct

  return availableHoursArray;
};

export const renderHour = ({
  hour,
  paymentSessions,
  productDuration,
  productPrepareHours,
  dayHourEnd,
  dayExceptions,
  appointments,
}: {
  hour: Date;
  appointments: ICalendarTermsData["appointments"];
  paymentSessions: ICalendarTermsData["paymentSessions"];
  productDuration: number;
  productPrepareHours: number;
  dayHourEnd: Date;
  dayExceptions: ICalendarTermsData["workSchedules"][0]["days"][0]["exceptions"];
}) => {
  // 7.1  - nie znajduje się w czasie product.prepareHours -> godzina od obecnej godziny np. czas przygotowania 12h.
  //sprawdzenie czy godzina jest dzień po obecnej dacie
  const datePrepare = addHours(new Date(), productPrepareHours);

  const hourIsAfter = isAfter(hour, datePrepare); //correct

  // console.log({ datePrepare, hourIsAfter, hour, productPrepareHours });

  if (!hourIsAfter) {
    return "unAvailable";
  }

  //   7.2  - nie znajduję się w czasie przed zakończeniem godzin pracy np. usługa trwa 60 min, a dzień konczy sie o 18.45, to ostatnia możliwa godzina to 17.45
  const hoursBeforeDayHourEnd = addMinutes(dayHourEnd, -productDuration);

  // const hourInHoursBeforeDayHourEnd = isWithinInterval(hour, {
  //   start: hoursBeforeDayHourEnd,
  //   end: dayHourEnd,
  // });

  if (isAfter(hour, hoursBeforeDayHourEnd)) {
    return "unAvailable";
  }

  if (dayExceptions) {
    //   7.1  - nie jest zawarta w przerwie dnia (exceptions.concat)
    const hourInExceptions = dayExceptions.some((exception) => {
      // const hourInException = isWithinInterval(hour, {
      //   start: exception.hourStart,
      //   end: exception.hourEnd,
      // });

      const hourInException =
        (isEqual(exception.hourStart, hour) ||
          isAfter(hour, exception.hourStart)) &&
        isBefore(hour, exception.hourEnd);

      return hourInException;
    });

    if (hourInExceptions) {
      return "unAvailableException";
    }

    //   7.2  - nie znajduję się w czasie przed przerwą np. usługa trwa 60 min, a przerwa zaczyna się o 13.20, to ostatnia możliwa godzina to 12.20
    const hourBeforeExceptionsStart = dayExceptions.some((exception) => {
      const hourBeforeExceptionStart = addMinutes(
        exception.hourStart,
        -productDuration
      );

      if (
        isAfter(hour, hourBeforeExceptionStart) &&
        isBefore(hour, exception.hourStart)
      ) {
        return true;
      }

      return false;
    });

    if (hourBeforeExceptionsStart) {
      return "unAvailableException";
    }
  }
  //   7.4  - payment session validation - data z godziną nie jest już zarezerwowana w sesji 30 min dla sesji po obecnej dacie, lub nie znajduje się przed rozpoczeciem rezerwacji - || -

  const reservationValid = currentDateReservationSessionCheck(
    hour,
    paymentSessions,
    productDuration
  );

  if (reservationValid !== "available") {
    return reservationValid;
  }

  //   7.4  - appointment validation - data z godziną nie jest już zarezerwowana, lub nie znajduje się przed rozpoczeciem spotkania - || -

  const appointmentValid = currentDateAppointmentsCheck(
    hour,
    appointments,
    productDuration
  );

  if (appointmentValid !== "available") {
    return appointmentValid;
  }

  return "available";
};
