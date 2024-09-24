import { useEffect, useState } from "react";

//services
import { addPaymentSessionWithReservation } from "./services/paymentSession.service";

import { addMinutes } from "date-fns";
import AppointmentHeading from "./components/heading/AppointmentHeading";
import AppointmentDescription from "./components/description/AppointmentDescription";
import AppointmentVariants from "./components/variants/AppointmentVariants";
import AppointmentNav, {
  ISelectedTermLocalization,
} from "./components/nav/AppointmentNav";
import AppointmentCalendar from "./components/calendar/AppointmentCalendar";
import { twMerge } from "tailwind-merge";
import {
  IProductVariantCategoryData,
  IProductVariantOptionData,
} from "./types/productVariant.types";
import { IProductPublicData } from "./types/product.types";
import { getProduct } from "./services/product.service";

export type IProductActiveVariant = {
  product: {
    businessTeamMember?: string;
    publicSettings: {
      slug: string;
      published: boolean;
    };
  } & Omit<IProductPublicData, "variant" | "businessTeamMember">;
  variantOptions: ({
    variantCategory: IProductVariantCategoryData;
  } & Omit<IProductVariantOptionData, "variantCategory">)[];
};

type IAppointmentLocation = {
  stationary: boolean;
  online: boolean;
  address?: string;
};

const AppointmentContentMiddleware = ({
  productSlug,
  businessTeamSlug,
}: {
  productSlug: string;
  businessTeamSlug: string;
}) => {
  const { product, productError, productLoading } = getProduct(
    businessTeamSlug,
    productSlug
  );

  if (productLoading) return <div>loading</div>;
  if (productError) return <div>error</div>;
  if (!product) return <div>nie znaleziono produktu</div>;

  return (
    <AppointmentContent product={product} businessTeamSlug={businessTeamSlug} />
  );
};

const AppointmentContent = ({
  product,
  businessTeamSlug,
}: {
  product: IProductPublicData;
  businessTeamSlug: string;
}) => {
  const [activeVariant, setActiveVariant] =
    useState<IProductActiveVariant | null>(null);

  useEffect(() => {
    if (product.variant?.isVariant) {
      const { variant, businessTeamMember, ...productWithoutVariantSettings } =
        product;

      setActiveVariant({
        variantOptions: product.variant.settings.variantOptions,
        product: {
          ...productWithoutVariantSettings,
          businessTeamMember: businessTeamMember?._id,
        },
      });
    }
  }, []);

  // const { handleAlert } = useAlert();

  const [reservationSubmitting, setReservationSubmitting] =
    useState<boolean>(false);

  const [location, setLocation] = useState<IAppointmentLocation>({
    stationary: false,
    online: false,
  });

  const [selectedTermLocalization, setSelectedTermLocalization] =
    useState<ISelectedTermLocalization>();

  const [newAppointmentDate, setNewAppointmentDate] = useState<Date | null>(
    null
  );

  //redirect to stripe checkout
  const appointmentReservationSubmit = async () => {
    console.log("reservation");
    if (!newAppointmentDate) return;

    setReservationSubmitting(true);

    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const productAsAppointment = product;

    try {
      const paymentSession = await addPaymentSessionWithReservation({
        appointmentReservation: {
          dateStart: newAppointmentDate,
          dateEnd: addMinutes(
            newAppointmentDate,
            productAsAppointment.appointmentSettings.duration
          ),
          locale,
          timeZone,
        },
        businessTeamSlug,
        products: [productAsAppointment._id], //możliwe dodanie innych produktów do koszyka
      });

      console.log({ paymentSession });
      // handleAlert("success", "Utworzono rezerwację");
      window.location.href = `https://calendpay.com/checkout/${paymentSession.data._id}`;
    } catch (e) {
      console.log(e);
      // handleAlert("error", "Utworzenie rezerwacji nie powiodło się");
      setReservationSubmitting(false);
    }
  };

  const removeNewDate = () => {
    setLocation({
      online: false,
      stationary: false,
    });
    setNewAppointmentDate(null);
  };

  const appointmentOrganizationMemberId =
    activeVariant?.product?.businessTeamMember ||
    product.businessTeamMember?._id;

  if (!appointmentOrganizationMemberId)
    throw new Error("Appointment organization member not found");

  const appointmentPrepareHours =
    activeVariant?.product?.appointmentSettings.prepareHours ||
    product.appointmentSettings.prepareHours ||
    1;

  const appointmentDuration =
    activeVariant?.product?.appointmentSettings.duration ||
    product.appointmentSettings.duration ||
    1;

  return (
    <div
      id="container"
      className="flex items-center justify-start flex-col gap-5 w-full py-4 xs:p-4 2xl:p-0"
    >
      <AppointmentNav
        appointmentReservationDate={newAppointmentDate}
        setAppointmentReservationDate={setNewAppointmentDate}
        removeAppointmentReservationDate={removeNewDate}
        appointmentReservationSubmit={appointmentReservationSubmit}
        appointmentReservationSubmitLoading={reservationSubmitting}
        location={location}
        setLocation={setLocation}
        isSubmitting={reservationSubmitting}
        selectedTermAvailableLocation={selectedTermLocalization}
        productTheme={product.publicSettings?.theme}
      />
      <div className="flex items-start justify-start flex-col gap-5 w-full md:flex-row">
        {/* product content */}
        <div className="flex items-start justify-start flex-col gap-5 w-full">
          <div className="flex w-full gap-5 flex-col md:flex-row">
            <AppointmentVariants
              product={product}
              activeVariant={activeVariant}
              setActiveVariant={setActiveVariant}
            />
            <AppointmentHeading
              product={product}
              activeVariant={activeVariant}
            />
          </div>
          <div className="flex w-full gap-5 flex-col-reverse lg:flex-row">
            {product.description && (
              <AppointmentDescription
                productDescription={
                  activeVariant?.product.description || product.description
                }
              />
            )}
            {/* product calendar */}
            <div
              className={twMerge(
                `flex items-start justify-start flex-col gap-5 w-full p-5 rounded-md border-2 ${
                  product.description && "lg:w-[36rem]"
                } `
              )}
              style={{
                backgroundColor:
                  product.publicSettings.theme?.backgroundColor || "#fafafa",
                borderColor:
                  product.publicSettings.theme?.borderColor || "#f1f5f9",
              }}
            >
              <AppointmentCalendar
                setLocation={setLocation}
                setSelectedTermLocalization={setSelectedTermLocalization}
                newAppointmentDate={newAppointmentDate}
                setNewAppointmentDate={setNewAppointmentDate}
                consultationId={activeVariant?.product._id || product._id}
                consultationOrganizationMemberId={
                  appointmentOrganizationMemberId
                }
                consultationDuration={appointmentDuration}
                consultationPrepareHours={appointmentPrepareHours}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentContentMiddleware;
