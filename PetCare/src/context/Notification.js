import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [banner, setBanner] = useState(null);

    const mostrarBanner = (titulo, mensagem) => {
        setBanner({
            titulo,
            mensagem,
        });

        setTimeout(() => {
            setBanner(null);
        }, 4000);
    };

    return (
        <NotificationContext.Provider
            value={{
                banner,
                mostrarBanner,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () =>
    useContext(NotificationContext);