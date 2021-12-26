import { useEffect, useRef } from 'react'

export const formatCurrency = (x) => {
    // const price = parseInt(x) * 23000;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const convertProductLink = (str) => {
    return str.toLowerCase().split(" ").join("-");
}

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
};

export const removeQueryParam = (name, _url) => {
    var reg = new RegExp("((&)*" + name + "=([^&]*))","g");
    return _url.replace(reg,'');
};

export const removeAccents = (str) => {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};