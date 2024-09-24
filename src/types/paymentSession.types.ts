import {
  IBusinessTeamMemberPublicData,
  IBusinessTeamPublicData,
} from "./businessTeam.types";
import { IProductPublicData } from "./product.types";

export type IAppointmentReservationData = {
  _id: string;
  dateStart: Date;
  dateEnd: Date;
  product: IProductPublicData["_id"];
  locale: string;
  timeZone: string;
  status: "succeeded" | "canceled" | "processing";
  createdAt: Date;
  updatedAt: Date;
};

export type IPaymentSessionInput = {
  businessTeamSlug: string;
  products: IProductPublicData["_id"][];
};

export type IPaymentSessionWithReservationInput = {
  appointmentReservation: {
    dateStart: Date;
    dateEnd: Date;
    locale: string;
    timeZone: string;
  };
} & IPaymentSessionInput;

//checkout page
export type IPaymentSessionData = {
  _id: string;
  expiresAt: Date;
  businessTeam: IBusinessTeamPublicData & {
    stripeAccountId?: string;
  };
  appointmentReservation?: IAppointmentReservationData;
  appointment?: {
    businessTeamMember: IBusinessTeamMemberPublicData;
    term: {
      availableLocations: string[];
    };
  } & Pick<
    IProductPublicData,
    | "_id"
    | "name"
    | "shortDescription"
    | "image"
    | "type"
    | "price"
    | "appointmentSettings"
    | "publicSettings"
  >;
  products: Pick<
    IProductPublicData,
    | "_id"
    | "name"
    | "shortDescription"
    | "image"
    | "type"
    | "price"
    | "publicSettings"
  >[];
  suggestedProducts?: Pick<
    IProductPublicData,
    "_id" | "name" | "image" | "shortDescription" | "price"
  >[];
  createdAt: Date;
  updatedAt: Date;
};
