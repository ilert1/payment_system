import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./AppContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
const queryClient = new QueryClient();

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <App />
            </AppProvider>
        </QueryClientProvider>
    </StrictMode>
);
