import React from "react";
import { isWithinInterval } from "date-fns";

//icons
import { CalendarCheck, MapPinIcon } from "lucide-react";

//components
import Button from "../Button";
import { formatDate } from "../../utils/formatDate";
import LoadingSpinner from "../LoadingSpinner";
import { twMerge } from "tailwind-merge";
import { IProductPublicData } from "../../types/product.types";
import { ICalendarTermsData } from "../../types/calendarTerms.types";

export type ISelectedTermLocalization =
  ICalendarTermsData["workSchedules"][0]["days"][0]["location"];

type IProductNavProps = {
  appointmentReservationDate: Date | null;
  setAppointmentReservationDate: React.Dispatch<
    React.SetStateAction<Date | null>
  >;
  removeAppointmentReservationDate: () => void;
  appointmentReservationSubmit: () => void;
  appointmentReservationSubmitLoading: boolean;
  selectedTermAvailableLocation?: ISelectedTermLocalization;
  location: {
    stationary: boolean;
    online: boolean;
    address?: string;
  };
  setLocation: React.Dispatch<
    React.SetStateAction<{
      stationary: boolean;
      online: boolean;
      address?: string;
    }>
  >;
  isSubmitting: boolean;
  productTheme?: IProductPublicData["publicSettings"]["theme"];
};

const locationIsValid = (
  selectedTermDate: Date,
  selectedHours?: {
    hourStart: string;
    hourEnd: string;
  }[]
) => {
  if (selectedHours) {
    //sprawdź czy wybrana godzina znajduje się w przedziale godzin

    const availableSelectedTerm = selectedHours.some((selectedHour) => {
      const hourInSelectedHours = isWithinInterval(selectedTermDate, {
        start: new Date(selectedHour.hourStart),
        end: new Date(selectedHour.hourEnd),
      });

      if (hourInSelectedHours) return true;
      return false;
    });

    return availableSelectedTerm;
  }

  return true;
};

const AppointmentNav = ({
  appointmentReservationDate,
  removeAppointmentReservationDate,
  appointmentReservationSubmit,
  appointmentReservationSubmitLoading,
  isSubmitting,
  selectedTermAvailableLocation,
  productTheme,
}: IProductNavProps) => {
  return (
    <>
      {appointmentReservationDate && (
        <div
          className={`flex items-start justify-start flex-col gap-4 w-full border-2 p-4 rounded-md z-10 sticky top-20`}
          style={{
            backgroundColor: productTheme?.backgroundColor || "#fafafa",
            borderColor: productTheme?.borderColor || "#f1f5f9",
          }}
        >
          <div className="flex items-start justify-start flex-col gap-4 w-full md:flex-row md:items-center md:justify-between">
            <div className="flex items-start justify-start flex-col gap-3 md:flex-row md:items-center">
              <span
                className="w-10 h-10 border flex items-center justify-center rounded-md"
                style={{
                  borderColor: productTheme?.borderColor || "#f1f5f9",
                  backgroundColor: productTheme?.contrastColor || "#f8fafc",
                }}
              >
                <CalendarCheck
                  className="w-5 h-5"
                  style={{
                    color: productTheme?.mainColor || "#2563eb",
                  }}
                />
              </span>
              <p
                className="text-md font-medium sm:items-center sm:flex-row"
                style={{
                  color: productTheme?.headingColor || "#172554",
                }}
              >
                {/* wizyta {location.online && !location.stationary && "online"}:{" "} */}
                wizyta:{" "}
                <b>
                  {formatDate(appointmentReservationDate, {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </b>
              </p>
            </div>
            <div className="flex items-start justify-start flex-col gap-4 w-full xs:flex-row xs:w-auto xs:items-center xs:justify-end">
              <Button
                size="base"
                variant="secondary"
                onClick={removeAppointmentReservationDate}
                className=" flex items-center justify-center w-full xs:w-auto bg-white border border-slate-200 hover:opacity-70"
              >
                anuluj
              </Button>
              <Button
                size="base"
                variant={isSubmitting ? "disabled" : "primary"}
                onClick={appointmentReservationSubmit}
                className="flex items-center justify-center w-full xs:w-auto gap-2"
                style={{
                  backgroundColor: productTheme?.mainColor || "#2563eb",
                }}
              >
                {appointmentReservationSubmitLoading && <LoadingSpinner />}
                umów się na wizytę
              </Button>
            </div>
          </div>
          {selectedTermAvailableLocation && (
            <>
              {(selectedTermAvailableLocation.online.available ||
                selectedTermAvailableLocation.stationary.available) && (
                <div className="flex flex-col gap-2 w-full">
                  <h3
                    className=" text-base font-semibold"
                    style={{
                      color: productTheme?.headingColor || "#172554",
                    }}
                  >
                    Dostępne lokalizacje:
                  </h3>
                  {selectedTermAvailableLocation.online.available &&
                    locationIsValid(
                      appointmentReservationDate,
                      selectedTermAvailableLocation.online.settings
                        ?.selectedHours
                    ) && (
                      <div
                        className="w-full flex items-start justify-start flex-col gap-2"
                        style={{
                          color: productTheme?.headingColor || "#172554",
                        }}
                      >
                        <div className="flex items-center justify-start gap-2">
                          <MapPinIcon className="w-4 h-4" />
                          <p className="text-sm font-normal">online</p>
                        </div>
                      </div>
                    )}

                  {selectedTermAvailableLocation.stationary.available && (
                    <div className="w-full flex items-start justify-start flex-col gap-2">
                      {selectedTermAvailableLocation.stationary.locations?.map(
                        (location, locationIndex) => (
                          <div
                            key={locationIndex + 1}
                            className={twMerge(
                              `w-full flex items-start justify-start flex-col gap-2 ${
                                !locationIsValid(
                                  appointmentReservationDate,
                                  location.settings.selectedHours
                                ) && "hidden"
                              }`
                            )}
                            style={{
                              color: productTheme?.headingColor || "#172554",
                            }}
                          >
                            <div className="flex items-center justify-start gap-2">
                              <MapPinIcon className="w-4 h-4" />
                              <p className="text-sm font-normal">
                                {location.address}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AppointmentNav;
