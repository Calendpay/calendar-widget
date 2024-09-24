import { ICalendarTermsData } from "../../../../../types/calendarTerms.types";
import { addMinutes, isAfter, isBefore } from "date-fns";

export const currentDateReservationSessionCheck = (
  hour: Date,
  paymentSessions: ICalendarTermsData["paymentSessions"],
  consultationDuration: number //czas trwania obecnie kupowanej usługi
) => {
  let availableHour: "appointmentReserved" | "available" = "available";

  for (const paymentSession of paymentSessions) {
    const productDuration = paymentSession.reservation.productDuration || 0; //czas trwania usługi w rezerwacji

    const hoursBeforeReservation = addMinutes(
      new Date(paymentSession.reservation.date),
      -consultationDuration //correct -> czas trwania obecnie kupowanej usługi
    );

    const hoursAfterReservation = addMinutes(
      new Date(paymentSession.reservation.date),
      productDuration
    );

    // const dateInReservation = isWithinInterval(hour, {
    //   start: hoursBeforeReservation,
    //   end: hoursAfterReservation,
    // });

    const dateInReservation =
      isAfter(hour, hoursBeforeReservation) &&
      isBefore(hour, hoursAfterReservation);

    const reservationCompleted = isAfter(
      new Date(),
      new Date(paymentSession.expiresAt)
    );

    if (dateInReservation && !reservationCompleted) {
      availableHour = "appointmentReserved";
      break; //godzina niedostępna do umówienia
    } //sprawdzić created at rezerwacji

    availableHour = "available";
  }

  return availableHour;
};
