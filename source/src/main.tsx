import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./AppContext";
import { BrowserRouter } from "react-router-dom";

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
