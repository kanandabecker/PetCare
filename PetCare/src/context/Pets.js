import { createContext, useContext, useState } from 'react';

const PetsContext = createContext();

export function PetsProvider({ children }) {
    const [petsAdocao, setPetsAdocao] = useState([]);

    const adicionarPet = (pet) => {
        setPetsAdocao((prev) => [pet, ...prev]);
    };

    const removerPet = (id) => {
        setPetsAdocao((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <PetsContext.Provider value={{ petsAdocao, adicionarPet, removerPet }}>
            {children}
        </PetsContext.Provider>
    );
}

export const usePets = () => useContext(PetsContext);