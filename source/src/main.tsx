import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@/app/styles/index.scss";
import { AppProvider } from "./AppContext";
import App from "./app/App";
import "./shared/config/i18n/Localization";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
const queryClient = new QueryClient();

root.render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AppProvider>
                    <App />
                </AppProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
);
