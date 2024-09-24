import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import AppointmentContent from "./AppointmentContent.tsx"; // Twój główny komponent
import "@fontsource/figtree/300.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";
import "@fontsource/figtree/800.css";
import "@fontsource/figtree/900.css";

// Funkcja, która osadza kalendarz w dowolnym elemencie HTML
const renderCalendarWidget = (props: {
  containerId: string;
  productSlug: string;
  organizationSlug: string;
}) => {
  const container = document.getElementById(props.containerId); // Znajduje element HTML po ID
  if (!container) {
    console.error(`Element with ID ${props.containerId} not found.`);
    return;
  }

  const root = createRoot(container); // Tworzy root dla React 18
  root.render(
    <React.StrictMode>
      <AppointmentContent
        productSlug={props.productSlug}
        businessTeamSlug={props.organizationSlug}
      />
    </React.StrictMode>
  );
};

export { renderCalendarWidget };
