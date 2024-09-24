function preprocessHtml(html: string) {
  return html.replace(/<p><\/p>/g, "<br>");
}

//render markdown
const AppointmentDescription = ({
  productDescription,
}: {
  productDescription: string;
}) => {
  return (
    <div
      className="bg-white rounded-md border-2 border-slate-100 p-5 w-full flex items-start justify-start flex-col text-blue-950 font-medium text-base [&>p]:text-base [&>p]:font-normal [&>h1]:font-bold [&>h2]:font-bold [&>h3]:font-bold [&>h4]:font-bold [&>h5]:font-bold [&>h6]:font-bold [&>h1]:text-3xl [&>h2]:text-2xl [&>h3]:text-xl [&>h4]:text-lg [&>h5]:text-lg [&>h6]:text-lg"
      dangerouslySetInnerHTML={{
        __html: preprocessHtml(productDescription),
      }}
    />
  );
};

export default AppointmentDescription;
