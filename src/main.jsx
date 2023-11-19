import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.scss";
import AuthProvider from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </AuthProvider>
);
