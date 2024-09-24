import { IProductPublicData } from "./product.types";

export type ICalendarTermsData = {
  appointments: {
    dateStart: Date;
    dateEnd: Date;
    confirmed: boolean;
    sessionExpiresAt: Date;
    // date: Date;
    // duration: number;
  }[];
  paymentSessions: {
    expiresAt: Date;
    reservation: {
      date: Date;
      productDuration: IProductPublicData["appointmentSettings"]["duration"];
    };
  }[];
  workSchedules: {
    weekStartDate: Date;
    weekEndDate: Date;
    weekStartDateFormat: string;
    weekEndDateFormat: string;
    days: {
      date: Date;
      dateFormat: string;
      hourStart?: Date;
      hourEnd?: Date;
      displayHourStepMinutes?: number; //czas pomiędzy wyświetlanymi godzinami w kalendarzu
      exceptions?: {
        hourStart: Date;
        hourEnd: Date;
      }[];
      products?: string[];
      status?: "on" | "off";
      location: {
        online: {
          available: boolean;
          settings?: {
            wholeDay: boolean;
            selectedHours?: {
              hourStart: string;
              hourEnd: string;
            }[];
          };
        };

        stationary: {
          available: boolean;
          locations?: {
            address: string;
            settings: {
              wholeDay: boolean;
              selectedHours?: {
                hourStart: string;
                hourEnd: string;
              }[];
            };
          }[];
        };
      };
    }[];
  }[];
};
