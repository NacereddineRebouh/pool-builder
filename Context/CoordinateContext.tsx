"use client"
import { CoordinatesContextType, CoordinatesType } from '@/types/coordinates';
import React, { useState } from 'react';

interface ICoordinatesContextProps {
    children:React.ReactNode
}

export const CoordinatesContext = React.createContext<CoordinatesContextType | null>(null);

const CoordinatesProvider: React.FunctionComponent<ICoordinatesContextProps> = ({children}) => {
    const [Coord, setCoord] = useState<CoordinatesType>({x:0,y:0,z:0})
    const UpdateCoordinates = (Coord: CoordinatesType) => {
        setCoord(Coord);
      };
  return (
   <CoordinatesContext.Provider value={{Coord,UpdateCoordinates}}>
    {children}
   </CoordinatesContext.Provider>
  );
};

export default CoordinatesProvider;
