const AppointmentContent = ({
  productId,
  organizationId,
}: {
  productId: string;
  organizationId: string;
}) => {
  return (
    <div>
      <p>Kalendarz</p>
      <p>productId: {productId}</p>
      <p>organizationId: {organizationId}</p>
    </div>
  );
};

export default AppointmentContent;
