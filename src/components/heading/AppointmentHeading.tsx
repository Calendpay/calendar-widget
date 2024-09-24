import { formatPrice } from "../../utils/formatPrice";
import { ImageIcon } from "lucide-react";
import { IProductPublicData } from "../../types/product.types";
import { IProductActiveVariant } from "../../AppointmentContent";

const AppointmentHeading = ({
  product,
  activeVariant,
}: {
  product: IProductPublicData;
  activeVariant: IProductActiveVariant | null;
}) => {
  return (
    <div
      className="flex items-start justify-start flex-col gap-5 w-full border-2  p-5 rounded-md"
      style={{
        backgroundColor:
          product.publicSettings.theme?.backgroundColor || "#fafafa",
        borderColor: product.publicSettings.theme?.borderColor || "#f1f5f9",
      }}
    >
      {product.price.saleAmount && (
        <div className="flex items-start justify-start py-2 px-4 text-white text-xs font-medium rounded-md bg-red-600">
          promocja
        </div>
      )}
      <div className="flex items-start justify-start flex-col gap-6 w-full sm:flex-row">
        {activeVariant && activeVariant.product.image ? (
          <img
            src={activeVariant.product.image.url}
            alt="product image"
            width={200}
            height={200}
            className="w-40 h-40 aspect-square rounded-lg object-cover"
          />
        ) : (
          <>
            {product.image ? (
              <img
                src={product.image.url}
                alt="product image"
                width={200}
                height={200}
                className="w-32 h-32 rounded-lg object-cover"
              />
            ) : (
              <div className=" aspect-square  w-32 h-32 p-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <ImageIcon className=" text-white w-full h-full" />
              </div>
            )}
          </>
        )}

        <div className="flex items-start justify-start flex-col gap-2 w-full">
          <h1
            className="text-xl font-semibold"
            style={{
              color: product.publicSettings.theme.headingColor || "#172554",
            }}
          >
            {product.variant?.isVariant
              ? product.variant?.parentProduct.name
              : product.name}
          </h1>
          {activeVariant && (
            <div className="w-full flex items-start justify-start flex-col gap-2 ">
              {activeVariant.variantOptions?.map((variantOption) => (
                <div
                  key={variantOption._id}
                  className="flex items-start justify-start flex-col gap-1"
                >
                  <label className="text-xs font-normal text-slate-500">
                    {variantOption.variantCategory.name}
                  </label>
                  <div className="p-2 border border-slate-200 bg-slate-50 rounded-md text-blue-950 text-sm">
                    {variantOption.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeVariant ? (
            <>
              {activeVariant.product.price.saleAmount ? (
                <div>
                  <p className="text-xl font-bold my-2 text-blue-950">
                    {formatPrice(activeVariant.product.price.saleAmount, {
                      currency: activeVariant.product.price.currency,
                    })}
                  </p>
                  <p className="text-xl font-bold my-2 text-blue-950 line-through">
                    {formatPrice(activeVariant.product.price.amount, {
                      currency: activeVariant.product.price.currency,
                    })}
                  </p>
                </div>
              ) : (
                <p className="text-xl font-bold my-2 text-blue-950">
                  {formatPrice(activeVariant.product.price.amount, {
                    currency: activeVariant.product.price.currency,
                  })}
                </p>
              )}
            </>
          ) : (
            <p className="text-xl font-bold my-2 text-blue-950">
              {formatPrice(product.price.amount, {
                currency: product.price.currency,
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentHeading;
