//v9
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Initialize Cloud Firestore through Firebase
const firebaseConfig = {
	apiKey: 'AIzaSyD-BfZjl4hBkcgrq_MEvNA1buYMqDAQUUg',
	authDomain: 'learn-react-2816d.firebaseapp.com',
	databaseURL: 'https://learn-react-2816d-default-rtdb.firebaseio.com',
	projectId: 'learn-react-2816d',
	storageBucket: 'learn-react-2816d.appspot.com',
	messagingSenderId: '602412042352',
	appId: '1:602412042352:web:434c54982a370b98a60cb5',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const products = [
	{
		brand: 'Nokia',
        category: "smartphone",
		id: 's7',
		img: 'https://cdn.tgdd.vn/Products/Images/42/230812/nokia-8000-den-new-600x600-600x600.jpg',
		name: 'Nokia 8000 4G',
		price: 80,
		specs: {
			camera: '2 MP',
			display: 'TFT LCD 2.8", 16 triệu màu',
			os: 'KaiOS',
			sim: '2 Nano SIM, Hỗ trợ 4G',
		},
	},
	{
		brand: 'Samsung',
        category: "smartphone",
		id: 's8',
		img: 'https://cdn.tgdd.vn/Products/Images/42/237603/samsung-galaxy-a22-4g-black-600x600.jpg',
		name: 'Samsung Galaxy A2',
		price: 230,
		specs: {
			camera: 'Chính 48 MP & Phụ 8 MP, 2 MP, 2 MP',
			chip: 'MediaTek MT6769V',
			display: 'Super AMOLED, 6.4", HD+',
			os: 'Android 11',
			ram: 6,
			rom: 128,
			sim: '2 Nano SIM, Hỗ trợ 4G',
		},
	},
	{
		brand: 'Apple',
        category: "smartphone",
		id: 's9',
		img: 'https://cdn.tgdd.vn/Products/Images/42/225380/iphone-12-mini-den-15-600x600.jpg',
		name: 'iPhone 12 mini',
		price: 720,
		specs: {
			camera: '2 camera 12 MP',
			chip: 'Apple A14 Bionic',
			display: 'OLED5.4" Super Retina XDR',
			os: 'iOS 14',
			ram: 4,
			rom: 64,
			sim: '1 Nano SIM & 1eSIM, Hỗ trợ 5G',
		},
	},
];

products.forEach(product => {
	db.collection('products').add({
        id: product.id,
        category: product.category,
        brand: product.brand,
        name: product.name,
        img: product.img,
        price: product.price,
        specs: product.specs ? product.specs : null
    })
    .then(function (docRef) {
        console.log('Document written with ID: ', docRef.id);
    })
    .catch(function (error) {
        console.error('Error adding document: ', error);
    });
});
