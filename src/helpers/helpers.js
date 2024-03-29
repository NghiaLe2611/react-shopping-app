import { useEffect, useRef } from 'react'

export const shippingFee = 15000;
export const fastShippingFee = 30000;
export const colorCodeList = ['Đen', 'Bạc', 'Xanh dương', 'Vàng đồng', 'Đỏ', 'Trắng', 'Xám đậm'];

export const formatCurrency = (x) => {
    // const price = parseInt(x) * 23000;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const readPrice = (price) => {
    const zeroCount = price.toString().split('0').length - 1;
    const firstCharCount = price.toString().length - zeroCount;
    const firstChar = price.toString().substring(0, firstCharCount);

    switch (zeroCount) {
        case 5:
            return price.toString().substring(0, 3) + 'K';
        case 6:
            return firstChar + ' triệu';
        default:
            return;
    }
};

export const convertCardNumber = (num) => {
    let dots = '';
    const dotLength = 16 - num.length;

    for (let i = 0; i < dotLength; i++) {
        dots += '•';
    }

    return (num + dots).match(/.{1,4}/g).join(' ');
};

export const convertCardExpiry = (num) => {
    let dots = '';
    const dotLength = 4 - num.length;

    for (let i = 0; i < dotLength; i++) {
        dots += '•';
    }

    return (num + dots).match(/.{1,2}/g).join('/');
};

export const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const convertProductLink = (str) => {
    return str.toLowerCase().split(" ").join("-").replace(/\//g, '-');
};

export const removeQueryParam = (name, _url) => {
    var reg = new RegExp("((&)*" + name + "=([^&]*))", "g");
    return _url.replace(reg, '');
};

export const removeAccents = (str) => {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

export const timeSince = (date) => {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + ' năm trước';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + ' tháng trước';
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + ' ngày trước';
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + ' giờ trước';
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + ' phút trước';
    }
    return Math.floor(seconds) + ' giây trước';
};

export const convertDateTime = (date) => {
    const day = new Date(date).getDate();
    let month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();
    const hour = new Date(date).getHours();
    const minute = new Date(date).getMinutes();

    if (month.toString().length === 1) {
        month = '0' + month;
    }

    return hour + ':' + minute + ' ' + day + '/' + month + '/' + year;
};

export const getDayName = (date) => {
    const dayNameData = [{
            id: 0,
            day: "Chủ Nhật"
        },
        {
            id: 1,
            day: "Thứ hai",
        }, {
            id: 2,
            day: "Thứ ba",
        }, {
            id: 3,
            day: "Thứ tư",
        }, {
            id: 4,
            day: "Thứ năm",
        },
        {
            id: 5,
            day: "Thứ sáu",
        },
        {
            id: 6,
            day: "Thứ bảy",
        }
    ];

    let currentDate = new Date();
    let deliverDate = currentDate.setDate(currentDate.getDate() + 3);
    let day = new Date(deliverDate).getDate();
    let month = new Date(deliverDate).getMonth() + 1;
    if (day.toString().length === 1) {
        day = '0' + day;
    }
    if (month.toString().length === 1) {
        month = '0' + month;
    }
    const dayObj = dayNameData.find(o => o.id === new Date(deliverDate).getDay());

    return dayObj.day + ` (${day}/${month})`;
};

export const emailIsValid = (email) => {
    const regex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm;
    return email.match(regex);
};

export const passwordIsValid = (password) => {
    // Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and no special character
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

    // Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    return password.match(regex);
};

export const getOrderStatus = (status) => {
    if (status === 1) return 'Đang xử lý';
    if (status === 2) return 'Đang vận chuyển';
    if (status === 3) return 'Giao hàng thành công';
    if (status === 4) return 'Đã huỷ';
};

export const getPaymentMethod = (method) => {
    if (method === 'p1') return 'Thanh toán khi nhận hàng';
    if (method === 'p2') return 'Thanh toán bằng ZaloPay';
    if (method === 'p3') return 'Thanh toán qua thẻ tín dụng, Visa'
};

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};