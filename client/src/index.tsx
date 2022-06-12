import ReactDOM from "react-dom";
import App from "./app/App";
import "./index.scss";
import { Provider } from "react-redux";
import { setUpStore } from "./app/store/store";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import AppLoader from "./app/components/ui/hoc/AppLoader";
import { QueryClient, QueryClientProvider } from "react-query";

const store = setUpStore();
export const queryClient = new QueryClient();

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppLoader>
            <App />
          </AppLoader>
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);
