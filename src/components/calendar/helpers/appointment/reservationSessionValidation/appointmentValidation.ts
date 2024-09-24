import { ICalendarTermsData } from "../../../../../types/calendarTerms.types";
import { addMinutes, isAfter, isBefore } from "date-fns";

export const currentDateAppointmentsCheck = (
  hour: Date,
  appointments: ICalendarTermsData["appointments"],
  consultationDuration: number
) => {
  let availableHour:
    | "appointmentReserved"
    | "appointmentConfirmed"
    | "available" = "available";

  for (const appointment of appointments) {
    //obliczyć appointment duration z appointment.dateStart i appointment.dateEnd
    // const appointmentDurationInMinutes = differenceInMinutes(new Date(appointment.dateEnd), new Date(appointment.dateStart));

    const hoursBeforeAppointment = addMinutes(
      new Date(appointment.dateStart),
      -consultationDuration
    );
    // const hoursAfterAppointment = addMinutes(
    //   new Date(appointment.date),
    //   appointmentDurationInMinutes
    // );

    const dateInAppointment =
      isAfter(hour, hoursBeforeAppointment) &&
      isBefore(hour, new Date(appointment.dateEnd));

    if (dateInAppointment && appointment.confirmed) {
      // console.log({ dateInAppointment });
      // availableHour = "appointmentConfirmed";
      availableHour = "appointmentReserved";
      break; //godzina niedostępna do umówienia
    }

    // const appointmentReservationCompleted = isAfter(
    //   new Date(),
    //   new Date(appointment.sessionExpiresAt as Date)
    // );

    // if (dateInAppointment && !appointmentReservationCompleted) {
    //   availableHour = "appointmentReserved";
    //   break; //godzina niedostępna do umówienia
    // } //sprawdzić created at rezerwacji

    availableHour = "available";
  }

  return availableHour;
};
