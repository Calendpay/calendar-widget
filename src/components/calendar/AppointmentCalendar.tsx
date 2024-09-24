import React, { useState, useEffect } from "react";
import Button from "../Button";
import {
  Calendar,
  CalendarOff,
  CalendarOffIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

//date-fns
import {
  format,
  isEqual,
  eachDayOfInterval,
  addDays,
  isSameDay,
} from "date-fns";
import { pl } from "date-fns/locale";
import { getCalendarTerms } from "../../services/calendarTerms.service";
import {
  ICalendarVaildDay,
  calendarValidDates,
} from "./helpers/appointment/calendarValidDates";
import { formatDate } from "../../utils/formatDate";
import { twMerge } from "tailwind-merge";
import { getNextAvailableTerm } from "./helpers/appointment/nextAvailableTerm";
import { ISelectedTermLocalization } from "../nav/AppointmentNav";

interface ICalendarProps {
  setLocation: React.Dispatch<
    React.SetStateAction<{
      stationary: boolean;
      online: boolean;
      address?: string;
    }>
  >;
  consultationId: string;
  consultationOrganizationMemberId?: string;
  consultationDuration: number;
  consultationPrepareHours: number;
  newAppointmentDate: Date | null;
  setNewAppointmentDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setSelectedTermLocalization: React.Dispatch<
    React.SetStateAction<ISelectedTermLocalization | undefined>
  >;
}

const AppointmentCalendar = ({
  consultationId,
  consultationOrganizationMemberId,
  consultationDuration,
  consultationPrepareHours,
  newAppointmentDate,
  setNewAppointmentDate,
  setSelectedTermLocalization,
}: ICalendarProps) => {
  const [noDatesAvailable, setNoDatesAvailable] = useState<boolean>(false);
  const [nextAvailableDate, setNextAvailableDate] = useState<Date>();

  const [calendarValidDays, setCalendarValidDays] =
    useState<ICalendarVaildDay[]>();

  const { calendarTerms, calendarTermsLoading, calendarTermsError } =
    getCalendarTerms(consultationOrganizationMemberId as string);

  const [calendarDays, setCalendarDays] = useState(
    eachDayOfInterval({
      start: new Date(),
      end: addDays(new Date(), 3),
    }) //correct
  );

  // 4 days view
  const prev4days = () => {
    setCalendarDays(
      eachDayOfInterval({
        start: addDays(calendarDays[0], -4),
        end: addDays(calendarDays[calendarDays.length - 1], -4),
      }) //correct
    );
  };

  const next4days = () => {
    setCalendarDays(
      eachDayOfInterval({
        start: addDays(calendarDays[0], +4),
        end: addDays(calendarDays[calendarDays.length - 1], +4),
      }) //correct
    );
  };

  const sendToAvailableTerm = () => {
    if (!nextAvailableDate) return;
    //wykorzystać addWeeks , add 4 days

    const dates = eachDayOfInterval({
      // start: new Date(calendarDays[0]),
      start: new Date(),
      end: new Date(nextAvailableDate),
    }); //correct

    const divideIntoRanges = (arr: Date[], maxItemsPerRange: number) => {
      const ranges: Date[][] = [];

      for (let i = 0; i < arr.length; i += maxItemsPerRange) {
        const range = arr.slice(i, i + maxItemsPerRange);
        ranges.push(range);
      }

      return ranges;
    };

    const dateRanges = divideIntoRanges(dates, 4);

    let foundRange: Date[] | undefined = undefined;

    for (const range of dateRanges) {
      for (const date of range) {
        const currentDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        const availableDate = new Date(
          nextAvailableDate.getFullYear(),
          nextAvailableDate.getMonth(),
          nextAvailableDate.getDate()
        );

        if (isEqual(currentDate, availableDate)) {
          foundRange = range;
          break;
        }
      }

      if (foundRange) {
        break;
      }
    }

    //correct

    if (!foundRange) return;

    setCalendarDays(
      eachDayOfInterval({
        start: foundRange[0],
        end: addDays(new Date(foundRange[0]), +3),
      }) //correct
    );
  };

  //validacja terminów
  useEffect(() => {
    if (calendarTerms && calendarDays) {
      if (
        !calendarTerms.workSchedules ||
        calendarTerms.workSchedules.length < 1
      ) {
        //przefiltrować tutaj najbliższe terminy
        //sprawdzić wszystkie godziny w dostępnych terminach po obecnej dacie
        // w ten sposób można sprawdzić czy są dostępne terminy i jaki jest najbliższy termin

        setNoDatesAvailable(true);
        setNextAvailableDate(undefined);
        return;
      }

      const nextAvailableTerm = getNextAvailableTerm({
        workSchedules: calendarTerms.workSchedules,
        consultationDuration: consultationDuration,
        consultationPrepareHours: consultationPrepareHours,
        productId: consultationId,
        appointments: calendarTerms.appointments,
        paymentSessions: calendarTerms.paymentSessions,
      });

      if (!nextAvailableTerm) {
        setNoDatesAvailable(true);
        setNextAvailableDate(undefined);
        return;
      }
      //correct
      setNextAvailableDate(nextAvailableTerm);

      const newCalendarDays = calendarValidDates({
        days: calendarDays,
        workSchedules: calendarTerms.workSchedules,
        productId: consultationId,
        productDuration: consultationDuration,
        productPrepareHours: consultationPrepareHours,
        appointments: calendarTerms.appointments,
        paymentSessions: calendarTerms.paymentSessions,
        // consultationDuration,
        // consultationPrepareHours,
      });

      //for następne availableTerms sprawdź czy jest dostępna godzina i przerwij

      setCalendarValidDays(newCalendarDays);
      setNoDatesAvailable(false);
    }
  }, [calendarTerms, calendarDays, consultationId]);

  console.log({ calendarValidDays });

  const selectTerm = (date: Date) => {
    //1. Znajdź weekly work schedule day z tą godziną
    const allDays = calendarTerms?.workSchedules.flatMap(
      (workSchedule) => workSchedule.days
    );
    const weeklyWorkScheduleDay = allDays?.find((day) =>
      isSameDay(new Date(day.date), new Date(date))
    );

    // console.log({ weeklyWorkScheduleDay });

    //2. Wybierz datę i lokalizację (setState)
    if (weeklyWorkScheduleDay?.location) {
      setSelectedTermLocalization(weeklyWorkScheduleDay.location);
    }

    setNewAppointmentDate(date);
  };

  if (calendarTermsLoading)
    return (
      <div className="flex items-start justify-start flex-col w-full min-h-96 gap-4 p-3">
        <div className="animate-pulse flex items-center justify-start w-full gap-4">
          <div className="rounded-full bg-slate-200 h-8 w-8"></div>
          <div className="flex flex-1 flex-col gap-2.5 w-full">
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>

        <div className="animate-pulse flex items-center justify-center w-full gap-4 my-5">
          <div className="flex flex-1 gap-2 w-full">
            <div className="h-6 bg-slate-200 rounded flex-1"></div>
            <div className="h-6 bg-slate-200 rounded flex-1"></div>
          </div>

          <div className="rounded-full bg-slate-200 h-8 w-8"></div>
        </div>

        <div className=" animate-pulse grid grid-cols-4 w-full gap-2.5">
          {Array.from({ length: 40 }).map((_, index) => (
            <span key={index} className="h-8 bg-slate-200 rounded-md"></span>
          ))}
        </div>
      </div>
    );

  if (calendarTermsError)
    return (
      <div className="flex items-center justify-center flex-col w-full min-h-96 gap-8">
        <span className="flex items-center justify-center p-5 rounded-full bg-blue-50">
          <CalendarOff className="w-6 h-6 text-blue-600" />
        </span>
        <p className="text-center text-blue-950 text-md font-medium">
          Wystąpił błąd podczas pobierania dostępnych terminów
        </p>
      </div>
    );

  if (noDatesAvailable)
    return (
      <div className="flex items-center justify-center flex-col w-full min-h-96 gap-8">
        <span className="flex items-center justify-center p-5 rounded-full bg-blue-50">
          <CalendarOff className="w-6 h-6 text-blue-600" />
        </span>
        <p className="text-center text-blue-950 text-md font-medium">
          Brak dostępnych terminów
        </p>
      </div>
    );

  const selectedHour = (hour: Date) => {
    return !newAppointmentDate ? false : isEqual(hour, newAppointmentDate);
  };

  return (
    <div className="flex items-center justify-center flex-col gap-5 w-full">
      <div className="flex items-start justify-start flex-col w-full gap-5">
        {nextAvailableDate && (
          <div className=" flex items-center justify-start gap-5 rounded-md border-2 border-dashed border-slate-100 w-full p-4">
            <span className=" flex items-center justify-center bg-blue-50 rounded-full p-2">
              <Calendar className=" w-4 h-4 text-blue-600" />
            </span>

            <div className="flex items-start justify-start flex-col gap-2">
              <h2 className=" text-blue-950 text-sm font-medium">
                najbliższy dostępny termin:
              </h2>
              <p className=" text-blue-950 text-base font-medium">
                {formatDate(nextAvailableDate, {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
              <Button
                variant="primary"
                size="small"
                type="button"
                onClick={sendToAvailableTerm}
              >
                przejdź do terminu
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center w-full gap-5 py-2">
          {!isSameDay(calendarDays[0], new Date()) && (
            <button
              type="button"
              onClick={prev4days}
              className=" transition ease-out flex items-center justify-center p-2 rounded-full border-none cursor-pointer bg-blue-50 hover:opacity-70 "
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
            </button>
          )}

          <h2 className=" text-blue-950 text-lg font-medium">
            {formatDate(calendarDays[0], {
              day: "numeric",
              month: "long",
            })}{" "}
            -{" "}
            {formatDate(calendarDays[calendarDays.length - 1], {
              day: "numeric",
              month: "long",
            })}
          </h2>
          <button
            type="button"
            onClick={next4days}
            className=" transition ease-out flex items-center justify-center p-2 rounded-full border-none cursor-pointer bg-blue-50 hover:opacity-70 "
          >
            <ChevronRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>

        <div className="flex items-start justify-start gap-2 flex-col w-full">
          <div className=" grid grid-cols-4 w-full gap-2">
            {calendarDays.map((dayInfo, dayIndex) => (
              <div
                className=" flex items-center justify-center p-2"
                key={dayIndex + 1}
              >
                <p className=" text-blue-950 text-sm font-medium">
                  {format(dayInfo, "EE, d", { locale: pl })}
                </p>
              </div>
            ))}
          </div>

          {/* <p>najbliższe wolne terminy: {}</p> */}
          <div className="grid grid-cols-4 w-full gap-2">
            {calendarValidDays?.map((day) => (
              <div
                className={`flex items-start justify-start flex-col min-h-56 gap-1 xs:gap-2 border border-slate-200 rounded-md p-0.5 xs:p-2 ${
                  day.hours.length < 1 && "max-h-56"
                } `}
                key={day.dayKey}
              >
                {day.hours.length < 1 ? (
                  <div className="flex items-center justify-center flex-col w-full h-56 gap-2">
                    <CalendarOffIcon className="w-7 h-7 xs:w-10 xs:h-10 text-slate-200" />
                  </div>
                ) : (
                  day.hours.map(({ hour, hourKey, hourStatus }) => (
                    <div
                      className={twMerge(
                        ` flex items-center justify-center w-full py-2 px-3 border border-slate-200 rounded-md text-blue-950 text-sm font-medium cursor-pointer transition ease-out hover:opacity-70 ${
                          hourStatus === "appointmentConfirmed" ||
                          (hourStatus === "appointmentReserved" &&
                            "line-through text-slate-300 pointer-events-none")
                        } ${
                          (hourStatus === "unAvailable" ||
                            hourStatus === "unAvailableException") &&
                          " text-slate-300 pointer-events-none"
                        } ${
                          selectedHour(hour) &&
                          " text-blue-600 border border-dashed border-blue-600"
                        }`
                      )}
                      key={hourKey}
                      onClick={() => selectTerm(hour)}
                    >
                      {hourStatus === "available" ||
                      hourStatus === "appointmentConfirmed" ||
                      hourStatus === "appointmentReserved"
                        ? format(hour, "kk:mm")
                        : "-"}
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
