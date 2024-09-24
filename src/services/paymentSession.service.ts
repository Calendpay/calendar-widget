import axiosInstance from "../utils/axiosInstance";
import {
  IPaymentSessionData,
  IPaymentSessionWithReservationInput,
} from "../types/paymentSession.types";

export const paymentSessionURL = "/api/v2/payment-session";

export const addPaymentSessionWithReservation = async (
  data: IPaymentSessionWithReservationInput
) => {
  try {
    const newPaymentSessionWithReservation =
      await axiosInstance.post<IPaymentSessionData>(
        `${paymentSessionURL}/reservation`,
        data
      );
    return newPaymentSessionWithReservation;
  } catch (e) {
    throw e;
  }
};
