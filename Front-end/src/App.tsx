import { Provider } from "react-redux";
import RouteApp from "./routes/RouteApp"
import "@/assets/css/main.scss";
import { persistor, store } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={false} persistor={persistor}>
                <ToastContainer />
                <RouteApp />
            </PersistGate>
        </Provider>
    )
}

export default App
