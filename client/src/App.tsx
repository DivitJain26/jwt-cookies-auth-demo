import { FC } from "react";
import { AuthProvider } from "./context/AuthContext.tsx";
import AppRouter from "./routes/AppRouter.tsx";


const App: FC = () => {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
};

export default App;
