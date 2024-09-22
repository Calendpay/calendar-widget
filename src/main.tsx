import { createRoot } from "react-dom/client";
import "./index.css";
import AppointmentContent from "./AppointmentContent.tsx"; // Twój główny komponent

if (typeof process === "undefined") {
  (window as any).process = {
    env: {
      NODE_ENV: "production",
    },
  };
}

// Funkcja, która osadza kalendarz w dowolnym elemencie HTML
const renderCalendarWidget = (props: {
  containerId: string;
  productId: string;
  organizationId: string;
}) => {
  const container = document.getElementById(props.containerId); // Znajduje element HTML po ID
  if (!container) {
    console.error(`Element with ID ${props.containerId} not found.`);
    return;
  }

  const root = createRoot(container); // Tworzy root dla React 18
  root.render(
    // <React.StrictMode>
    <AppointmentContent
      productId={props.productId}
      organizationId={props.organizationId}
    />
    // </React.StrictMode>
  );
};

export { renderCalendarWidget };
