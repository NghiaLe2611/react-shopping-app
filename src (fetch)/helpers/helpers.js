import { useEffect, useRef } from 'react'

export const formatCurrency = (x) => {
    const price = parseInt(x) * 23000;
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
};