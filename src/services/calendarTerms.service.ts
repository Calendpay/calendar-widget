import useSWR from "swr";
import { swrPublicFetcher } from "../utils/swrFetcher";
import { ICalendarTermsData } from "../types/calendarTerms.types";

const calendarTermsURL = "/api/v2/calendar-terms";

export const getCalendarTerms = (businessTeamMemberId: string) => {
  const { data, isLoading, error } = useSWR<ICalendarTermsData>(
    `${calendarTermsURL}/${businessTeamMemberId}`,
    swrPublicFetcher
  );

  return {
    calendarTerms: data,
    calendarTermsLoading: isLoading,
    calendarTermsError: error,
  };
};
