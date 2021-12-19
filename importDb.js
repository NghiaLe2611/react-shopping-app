import { MongoClient } from 'mongodb';

// Connection URL
const client = await MongoClient.connect(
	'mongodb+srv://nghia:26111994@cluster0.io0lf.mongodb.net/react-db?retryWrites=true&w=majority'
);


const data = [
	{
		category: 'smartphone',
		brand: 'oppo',
		img: 'https://cdn.tgdd.vn/Products/Images/42/251703/oppo-a95-4g-bac-2-600x600.jpg',
		featureImgs: [
			'https://cdn.tgdd.vn/Products/Images/42/251703/Slider/vi-vn-oppo-a95-4g-tongquan-slider.jpg'
		],
		name: 'OPPO A95',
		price: 6990000,
		specs: {
			camera: 'Chính 48 MP & Phụ 2 MP, 2 MP',
			chip: 'Snapdragon 662',
			display: 'AMOLED6.43", Full HD+',
			os: 'Android 11',
			ram: 8,
			rom: 128,
			sim: '2 Nano SIM, Hỗ trợ 4G',
            pin: 5000
		},
		featured: true
	},
    {
        category: 'smartphone',
        brand: 'oppo',
        name: 'OPPO Find X3 Pro 5G',
        price: 23990000,
        specs: {
            camera: 'Chính 50 MP & Phụ 50 MP, 13 MP, 3 MP',
            chip: 'Snapdragon 888',
            display: 'AMOLED6.7", Quad HD+ (2K+)',
            os: 'Android 11',
            ram: 12,
            rom: 256,
            sim: '2 Nano SIM, Hỗ trợ 5G',
            pin: 4500
        },
        img: 'https://cdn.tgdd.vn/Products/Images/42/232190/oppo-find-x3-pro-black-001-1-600x600.jpg',
        featureImgs: [
            'https://cdn.tgdd.vn/Products/Images/42/232190/Slider/vi-vn-oppo-find-x3-pro-5g-tongquan.jpg',
            'https://cdn.tgdd.vn/Products/Images/42/232190/Slider/vi-vn-oppo-find-x3-pro-5g-camerasau.jpg',
            'https://cdn.tgdd.vn/Products/Images/42/232190/Slider/vi-vn-oppo-find-x3-pro-5g-thietke.jpg'
        ],
        variations: {
            colors: [
                {
                    color: 'Đen',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/232190/oppo-find-x3-pro-black-001-1-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/232190/oppo-find-x3-pro-den-1-org.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/232190/oppo-find-x3-pro-den-2-org.jpg'
                    ]
                },
                {
                    color: 'Xanh đen',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/232190/oppo-find-x3-pro-blue-001-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/232190/oppo-find-x3-pro-xanh-1-org.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/232190/oppo-find-x3-pro-xanh-2-org.jpg'
                    ]
                }
            ]
        },
        featured: false
    },
    {
		category: 'smartphone',
		brand: 'oppo',
		img: 'https://cdn.tgdd.vn/Products/Images/42/236187/oppo-reno6-pro-blue-1-600x600.jpg',
		featureImgs: [
			'https://cdn.tgdd.vn/Products/Images/42/236187/Slider/oppo-reno6-pro-5g637697083231582047.jpg'
		],
		name: 'OPPO Reno6 Pro 5G',
		price: 18990000,
		specs: {
			camera: 'Chính 50 MP & Phụ 16 MP, 13 MP, 2 MP',
			chip: 'Snapdragon 870 5G',
			display: 'AMOLED6.55", Full HD+',
			os: 'Android 11',
			ram: 12,
			rom: 256,
			sim: '2 Nano SIM, Hỗ trợ 5G',
            pin: 4500
		},
        sale: 500000,
		featured: false
	},
    {
		category: 'smartphone',
		brand: 'oppo',
		img: 'https://cdn.tgdd.vn/Products/Images/42/236186/oppo-reno6-5g-aurora-600x600.jpg',
		featureImgs: [
			'https://cdn.tgdd.vn/Products/Images/42/236187/Slider/oppo-reno6-pro-5g637697083231582047.jpg'
		],
		name: 'OPPO Reno6 5G',
		price: 12990000,
		specs: {
			camera: 'Chính 64 MP & Phụ 8 MP, 2 MP',
			chip: 'MediaTek Dimensity 900 5G',
			display: 'AMOLED6.43", Full HD+',
			os: 'Android 11',
			ram: 8,
			rom: 128,
			sim: '2 Nano SIM, Hỗ trợ 5G',
            pin: 4300
		},
		featured: false
	},
    {
		category: 'smartphone',
		brand: 'oppo',
		img: 'https://cdn.tgdd.vn/Products/Images/42/249944/oppo-a55-4g-blue-600x600.jpg',
		featureImgs: [
			'https://cdn.tgdd.vn/Products/Images/42/249944/Slider/oppo-a55-4g637701573072514668.jpg'
		],
		name: 'OPPO A55',
		price: 4990000,
		specs: {
			camera: 'Chính 50 MP & Phụ 2 MP, 2 MP',
			chip: 'MediaTek Helio G35',
			display: 'IPS LCD6.5"HD+',
			os: 'Android 11',
			ram: 4,
			rom: 64,
			sim: '2 Nano SIM, Hỗ trợ 4G',
            pin: 5000
		},
		featured: false
	},
    {
        category: 'smartphone',
        brand: 'apple',
        parent: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-2.jpg',
        name: 'iPhone 13 Pro 128GB',
        price: 30990000,
        specs: {
            camera: '3 camera 12 MP',
            chip: 'Apple A15 Bionic',
            display: 'OLED6.1", Super Retina XDR',
            os: 'iOS 15',
            ram: 6,
            rom: 128,
            sim: '1 Nano SIM & 1 eSIM, Hỗ trợ 5G',
            pin: 3095
        },
        img: 'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-sierra-blue-600x600.jpg',
        featureImgs: [
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/vi-vn-iphone-13-pro-slider-tong-quan.jpg',
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/vi-vn-iphone-13-pro-slider-hieu-nang.jpg',
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/iphone-13-pro-slider-ios15-1020x570.jpg'
        ],
        variations: {
            colors: [
                {
                    color: 'Vàng đồng',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-gold-1-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro3.jpg'
                    ]
                },
                {
                    color: 'Bạc',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-2.jpg'
                    ]
                },
                {
                    color: 'Xanh dương',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-sierra-blue-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-blue-1-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-blue-2.jpg'
                    ]
                },
                {
                    color: 'Xám',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-graphite-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-grey-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-grey-2.jpg'
                    ]
                }
            ],
            storage: [128, 256, 512, 1]
        },
        featured: true
    },
    {
        category: 'smartphone',
        brand: 'apple',
        parent: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-2.jpg',
        name: 'iPhone 13 Pro 256GB',
        price: 34490000,
        specs: {
            camera: '3 camera 12 MP',
            chip: 'Apple A15 Bionic',
            display: 'OLED6.1", Super Retina XDR',
            os: 'iOS 15',
            ram: 6,
            rom: 256,
            sim: '1 Nano SIM & 1 eSIM, Hỗ trợ 5G',
            pin: 3095
        },
        img: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-gold-1-600x600.jpg',
        featureImgs: [
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/vi-vn-iphone-13-pro-slider-tong-quan.jpg',
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/vi-vn-iphone-13-pro-slider-hieu-nang.jpg',
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/iphone-13-pro-slider-ios15-1020x570.jpg'
        ],
        variations: {
            colors: [
                {
                    color: 'Vàng đồng',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-gold-1-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro3.jpg'
                    ]
                },
                {
                    color: 'Bạc',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-2.jpg'
                    ]
                },
                {
                    color: 'Xanh dương',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-sierra-blue-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-blue-1-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-blue-2.jpg'
                    ]
                },
                {
                    color: 'Xám',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-graphite-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-grey-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-grey-2.jpg'
                    ]
                }
            ],
            storage: [128, 256, 512, 1]
        },
        featured: false
    },
    {
        category: 'smartphone',
        brand: 'apple',
        parent: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-2.jpg',
        name: 'iPhone 13 Pro 512GB',
        price: 39490000,
        specs: {
            camera: '3 camera 12 MP',
            chip: 'Apple A15 Bionic',
            display: 'OLED6.1", Super Retina XDR',
            os: 'iOS 15',
            ram: 6,
            rom: 512,
            sim: '1 Nano SIM & 1 eSIM, Hỗ trợ 5G',
            pin: 3095
        },
        img: 'https://cdn.tgdd.vn/Products/Images/42/250260/iphone-13-pro-graphite-600x600.jpg',
        featureImgs: [
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/vi-vn-iphone-13-pro-slider-tong-quan.jpg',
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/vi-vn-iphone-13-pro-slider-hieu-nang.jpg',
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/iphone-13-pro-slider-ios15-1020x570.jpg'
        ],
        variations: {
            colors: [
                {
                    color: 'Vàng đồng',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-gold-1-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro3.jpg'
                    ]
                },
                {
                    color: 'Bạc',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-2.jpg'
                    ]
                },
                {
                    color: 'Xanh dương',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-sierra-blue-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-blue-1-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-blue-2.jpg'
                    ]
                },
                {
                    color: 'Xám',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-graphite-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-grey-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-grey-2.jpg'
                    ]
                }
            ],
            storage: [128, 256, 512, 1]
        },
        featured: false
    },
    {
        category: 'smartphone',
        brand: 'apple',
        parent: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-2.jpg',
        name: 'iPhone 13 Pro 1TB',
        price: 43990000,
        specs: {
            camera: '3 camera 12 MP',
            chip: 'Apple A15 Bionic',
            display: 'OLED6.1", Super Retina XDR',
            os: 'iOS 15',
            ram: 6,
            rom: 1,
            sim: '1 Nano SIM & 1 eSIM, Hỗ trợ 5G',
            pin: 3095
        },
        img: 'https://cdn.tgdd.vn/Products/Images/42/250726/iphone-13-pro-silver-600x600.jpg',
        featureImgs: [
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/vi-vn-iphone-13-pro-slider-tong-quan.jpg',
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/vi-vn-iphone-13-pro-slider-hieu-nang.jpg',
            'https://cdn.tgdd.vn/Products/Images/42/230521/Slider/iphone-13-pro-slider-ios15-1020x570.jpg'
        ],
        variations: {
            colors: [
                {
                    color: 'Vàng đồng',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-gold-1-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro3.jpg'
                    ]
                },
                {
                    color: 'Bạc',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/250259/iphone-13-pro-silver-2.jpg'
                    ]
                },
                {
                    color: 'Xanh dương',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-sierra-blue-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-blue-1-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-blue-2.jpg'
                    ]
                },
                {
                    color: 'Xám',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-graphite-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-grey-1.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/230521/iphone-13-pro-grey-2.jpg'
                    ]
                }
            ],
            storage: [128, 256, 512, 1]
        },
        featured: false
    },
    {
		category: 'smartphone',
		brand: 'xiaomi',
		img: 'https://cdn.tgdd.vn/Products/Images/42/249080/redmi-10-blue-600x600.jpg',
		featureImgs: [
			'https://cdn.tgdd.vn/Products/Images/42/249080/Slider/xiaomi-redmi-10-DDNB1-1020x570-1.jpg'
		],
		name: 'Xiaomi Redmi 10 (4GB/64GB)',
		price: 3990000,
		specs: {
			camera: 'Chính 50 MP & Phụ 8 MP, 2 MP, 2 MP',
			chip: 'MediaTek Helio G88 8 nhân',
			display: 'IPS LCD 6.5", Full HD+',
			os: 'Android 11',
			ram: 4,
			rom: 64,
			sim: '2 Nano SIM, Hỗ trợ 4G',
            pin: 5000
		},
		featured: false
	},
    {
		category: 'smartphone',
		brand: 'xiaomi',
		img: 'https://cdn.tgdd.vn/Products/Images/42/235971/xiaomi-redmi-note-10-5g-xanh-bong-dem-1-600x600.jpg',
		featureImgs: [
			'https://cdn.tgdd.vn/Products/Images/42/235971/Slider/xiaomi-redmi-note-10-5G-tongquan-slider-1020x570.jpg'
		],
		name: 'Xiaomi Redmi Note 10 5G 8GB',
		price: 5990000,
		specs: {
			camera: 'Chính 48 MP & Phụ 2 MP, 2 MP',
			chip: 'MediaTek Dimensity 700',
			display: 'IPS LCD 6.5", Full HD+',
			os: 'Android 11',
			ram: 8,
			rom: 128,
			sim: '2 Nano SIM, Hỗ trợ 5G',
            pin: 5000
		},
		featured: false
	},
    {
		category: 'smartphone',
		brand: 'xiaomi',
		img: 'https://cdn.tgdd.vn/Products/Images/42/226264/xiaomi-mi-11-xanhduong-600x600-600x600.jpg',
		featureImgs: [
			'https://cdn.tgdd.vn/Products/Images/42/226264/Slider/vi-vn-xiaomi-mi-11-5g-tinhnang-slider.jpg',
            'https://cdn.tgdd.vn/Products/Images/42/226264/Slider/vi-vn-xiaomi-mi-11-5g-thietke-slider.jpg'
		],
		name: 'Xiaomi Mi 11 5G',
		price: 21990000,
		specs: {
			camera: 'Chính 108 MP & Phụ 13 MP, 5 MP',
			chip: 'Snapdragon 888',
			display: 'AMOLED6.81", Quad HD+ (2K+)',
			os: 'Android 11',
			ram: 8,
			rom: 256,
			sim: '2 Nano SIM, Hỗ trợ 5G',
            pin: 4600
		},
        variations: {
            colors: [
                {
                    color: 'Xanh dương',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/226264/xiaomi-mi-11-xanhduong-600x600-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/226264/xiaomi-mi-11-xanhduong-1-org.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/226264/xiaomi-mi-11-xanhduong-2-org.jpg'
                    ]
                },
                {
                    color: 'Xám đậm',
                    thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/226264/xiaomi-mi-11-xamdam-600x600-200x200.jpg',
                    images: [
                        'https://cdn.tgdd.vn/Products/Images/42/226264/xiaomi-mi-11-xamdam-1-org.jpg',
                        'https://cdn.tgdd.vn/Products/Images/42/226264/xiaomi-mi-11-xamdam-2-org.jpg'
                    ]
                }
            ]
        },
		featured: false
	}
];

async function main() {
	// Use connect method to connect to the server
	const db = client.db();
	const myCollection = db.collection('products');
	const insertResult = await myCollection.insertMany(data); // importData1.concat(importData2)

	console.log('Inserted documents =>', insertResult);

	return 'DONE.';
}

main()
	.then(console.log)
	.catch(console.error)
	.finally(() => client.close());
