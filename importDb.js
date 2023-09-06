import { MongoClient } from 'mongodb';

// Connection URL
const client = await MongoClient.connect(
	'mongodb+srv://nghia:26111994@cluster0.io0lf.mongodb.net/react-db?retryWrites=true&w=majority'
);

const data = [
	{
		name: 'Hồ Chí Minh',
		id: 1,
		districts: [
			{
				id: 484,
				name: 'Quận 1',
				wards: [
					{
						id: 10379,
						name: 'Phường Bến Nghé',
					},
					{
						id: 10380,
						name: 'Phường Bến Thành',
					},
					{
						id: 10381,
						name: 'Phường Cầu Kho',
					},
					{
						id: 10382,
						name: 'Phường Cầu Ông Lãnh',
					},
					{
						id: 10383,
						name: 'Phường Cô Giang',
					},
					{
						id: 10384,
						name: 'Phường Đa Kao',
					},
					{
						id: 10385,
						name: 'Phường Nguyễn Cư Trinh',
					},
					{
						id: 10386,
						name: 'Phường Nguyễn Thái Bình',
					},
					{
						id: 10387,
						name: 'Phường Phạm Ngũ Lão',
					},
					{
						id: 10388,
						name: 'Phường Tân Định',
					},
				]
			},
			{
				id: 485,
				name: 'Quận 2 - TP Thủ Đức',
				wards: [
					{
						id: 10431,
						name: 'Phường An Khánh',
					},
					{
						id: 10432,
						name: 'Phường An Lợi Đông',
					},
					{
						id: 10433,
						name: 'Phường An Phú',
					},
					{
						id: 10434,
						name: 'Phường Bình An',
					},
					{
						id: 10435,
						name: 'Phường Bình Khánh',
					},
					{
						id: 10436,
						name: 'Phường Bình Trưng Đông',
					},
					{
						id: 10437,
						name: 'Phường Bình Trưng Tây',
					},
					{
						id: 10438,
						name: 'Phường Cát Lái',
					},
					{
						id: 10439,
						name: 'Phường Thạnh Mỹ Lợi',
					},
					{
						id: 10440,
						name: 'Phường Thảo Điền',
					},
					{
						id: 10441,
						name: 'Phường Thủ Thiêm',
					},
				]
			},
			{
				id: 486,
				name: 'Quận 3',
				wards: [
					{
						id: 10442,
						name: 'Phường 01',
					},
					{
						id: 10443,
						name: 'Phường 02',
					},
					{
						id: 10444,
						name: 'Phường 03',
					},
					{
						id: 10445,
						name: 'Phường 04',
					},
					{
						id: 10446,
						name: 'Phường 05',
					},
					{
						id: 10447,
						name: 'Phường 06',
					},
					{
						id: 10448,
						name: 'Phường 07',
					},
					{
						id: 10449,
						name: 'Phường 08',
					},
					{
						id: 10450,
						name: 'Phường 09',
					},
					{
						id: 10451,
						name: 'Phường 10',
					},
					{
						id: 10452,
						name: 'Phường 11',
					},
					{
						id: 10453,
						name: 'Phường 12',
					},
					{
						id: 10454,
						name: 'Phường 13',
					},
					{
						id: 10455,
						name: 'Phường 14',
					}
				]
			},
			{
				id: 487,
				name: 'Quận 4',
				wards: [
					{
						id: 10456,
						name: 'Phường 01',
					},
					{
						id: 10457,
						name: 'Phường 02',
					},
					{
						id: 10458,
						name: 'Phường 03',
					},
					{
						id: 10459,
						name: 'Phường 04',
					},
					{
						id: 10460,
						name: 'Phường 05',
					},
					{
						id: 10461,
						name: 'Phường 06',
					},
					{
						id: 10462,
						name: 'Phường 08',
					},
					{
						id: 10463,
						name: 'Phường 09',
					},
					{
						id: 10464,
						name: 'Phường 10',
					},
					{
						id: 10465,
						name: 'Phường 12',
					},
					{
						id: 10466,
						name: 'Phường 13',
					},
					{
						id: 10467,
						name: 'Phường 14',
					},
					{
						id: 10468,
						name: 'Phường 15',
					},
					{
						id: 10469,
						name: 'Phường 16',
					},
					{
						id: 10470,
						name: 'Phường 18',
					}
				]
			},
			{
				id: 488,
				name: 'Quận 5',
				wards: [
					{
						id: 10471,
						name: 'Phường 01',
					},
					{
						id: 10472,
						name: 'Phường 02',
					},
					{
						id: 10473,
						name: 'Phường 03',
					},
					{
						id: 10474,
						name: 'Phường 04',
					},
					{
						id: 10475,
						name: 'Phường 05',
					},
					{
						id: 10476,
						name: 'Phường 06',
					},
					{
						id: 10477,
						name: 'Phường 07',
					},
					{
						id: 10478,
						name: 'Phường 08',
					},
					{
						id: 10479,
						name: 'Phường 09',
					},
					{
						id: 10480,
						name: 'Phường 10',
					},
					{
						id: 10481,
						name: 'Phường 11',
					},
					{
						id: 10482,
						name: 'Phường 12',
					},
					{
						id: 10483,
						name: 'Phường 13',
					},
					{
						id: 10484,
						name: 'Phường 14',
					},
					{
						id: 10485,
						name: 'Phường 15',
					}
				]
			},
			{
				id: 489,
				name: 'Quận 6',
				wards: [
					{
						id: 10486,
						name: 'Phường 01',
					},
					{
						id: 10487,
						name: 'Phường 02',
					},
					{
						id: 10488,
						name: 'Phường 03',
					},
					{
						id: 10489,
						name: 'Phường 04',
					},
					{
						id: 10490,
						name: 'Phường 05',
					},
					{
						id: 10491,
						name: 'Phường 06',
					},
					{
						id: 10492,
						name: 'Phường 07',
					},
					{
						id: 10493,
						name: 'Phường 08',
					},
					{
						id: 10494,
						name: 'Phường 09',
					},
					{
						id: 10495,
						name: 'Phường 10',
					},
					{
						id: 10496,
						name: 'Phường 11',
					},
					{
						id: 10497,
						name: 'Phường 12',
					},
					{
						id: 10498,
						name: 'Phường 13',
					},
					{
						id: 10499,
						name: 'Phường 14',
					}
				]
			},
			{
				id: 490,
				name: 'Quận 7',
				wards: [
					{
						id: 10500,
						name: 'Phường Bình Thuận',
					},
					{
						id: 10501,
						name: 'Phường Phú Mỹ',
					},
					{
						id: 10502,
						name: 'Phường Phú Thuận',
					},
					{
						id: 10503,
						name: 'Phường Tân Hưng',
					},
					{
						id: 10504,
						name: 'Phường Tân Kiểng',
					},
					{
						id: 10505,
						name: 'Phường Tân Phong',
					},
					{
						id: 10506,
						name: 'Phường Tân Phú',
					},
					{
						id: 10507,
						name: 'Phường Tân Quy',
					},
					{
						id: 10508,
						name: 'Phường Tân Thuận Đông',
					},
					{
						id: 10509,
						name: 'Phường Tân Thuận Tây',
					}
				]
			},
			{
				id: 491,
				name: 'Quận 8',
				wards: [
					{
						id: 10510,
						name: 'Phường 01',
					},
					{
						id: 10518,
						name: 'Phường 02',
					},
					{
						id: 10519,
						name: 'Phường 03',
					},
					{
						id: 10520,
						name: 'Phường 04',
					},
					{
						id: 10521,
						name: 'Phường 05',
					},
					{
						id: 10522,
						name: 'Phường 06',
					},
					{
						id: 10523,
						name: 'Phường 07',
					},
					{
						id: 10524,
						name: 'Phường 08',
					},
					{
						id: 10525,
						name: 'Phường 09',
					},
					{
						id: 10511,
						name: 'Phường 10',
					},
					{
						id: 10512,
						name: 'Phường 11',
					},
					{
						id: 10513,
						name: 'Phường 12',
					},
					{
						id: 10514,
						name: 'Phường 13',
					},
					{
						id: 10515,
						name: 'Phường 14',
					},
					{
						id: 10516,
						name: 'Phường 15',
					},
					{
						id: 10517,
						name: 'Phường 16',
					}
				]
			},
			{
				id: 492,
				name: 'Quận 9 - TP Thủ Đức',
				wards: [
					{
						id: 10526,
						name: 'Phường Hiệp Phú',
					},
					{
						id: 10527,
						name: 'Phường Long Bình',
					},
					{
						id: 10528,
						name: 'Phường Long Phước',
					},
					{
						id: 10529,
						name: 'Phường Long Thạnh Mỹ',
					},
					{
						id: 10530,
						name: 'Phường Long Trường',
					},
					{
						id: 10531,
						name: 'Phường Phú Hữu',
					},
					{
						id: 10532,
						name: 'Phường Phước Bình',
					},
					{
						id: 10533,
						name: 'Phường Phước Long A',
					},
					{
						id: 10534,
						name: 'Phường Phước Long B',
					},
					{
						id: 10536,
						name: 'Phường Tăng Nhơn Phú A',
					},
					{
						id: 10537,
						name: 'Phường Tăng Nhơn Phú B',
					},
					{
						id: 10535,
						name: 'Phường Tân Phú',
					},
					{
						id: 10538,
						name: 'Phường Trường Thạnh',
					}
				]
			},
			{
				id: 493,
				name: 'Quận 10',
				wards: [
					{
						id: 10389,
						name: 'Phường 01',
					},
					{
						id: 10390,
						name: 'Phường 02',
					},
					{
						id: 10391,
						name: 'Phường 03',
					},
					{
						id: 10392,
						name: 'Phường 04',
					},
					{
						id: 10393,
						name: 'Phường 05',
					},
					{
						id: 10394,
						name: 'Phường 06',
					},
					{
						id: 10395,
						name: 'Phường 07',
					},
					{
						id: 10396,
						name: 'Phường 08',
					},
					{
						id: 10397,
						name: 'Phường 09',
					},
					{
						id: 10398,
						name: 'Phường 10',
					},
					{
						id: 10399,
						name: 'Phường 11',
					},
					{
						id: 10400,
						name: 'Phường 12',
					},
					{
						id: 10401,
						name: 'Phường 13',
					},
					{
						id: 10402,
						name: 'Phường 14',
					},
					{
						id: 10403,
						name: 'Phường 15',
					}
				]
			},
			{
				id: 494,
				name: 'Quận 11',
				wards: [
					{
						id: 10404,
						name: 'Phường 01',
					},
					{
						id: 10412,
						name: 'Phường 02',
					},
					{
						id: 10413,
						name: 'Phường 03',
					},
					{
						id: 10414,
						name: 'Phường 04',
					},
					{
						id: 10415,
						name: 'Phường 05',
					},
					{
						id: 10416,
						name: 'Phường 06',
					},
					{
						id: 10417,
						name: 'Phường 07',
					},
					{
						id: 10418,
						name: 'Phường 08',
					},
					{
						id: 10419,
						name: 'Phường 09',
					},
					{
						id: 10405,
						name: 'Phường 10',
					},
					{
						id: 10406,
						name: 'Phường 11',
					},
					{
						id: 10407,
						name: 'Phường 12',
					},
					{
						id: 10408,
						name: 'Phường 13',
					},
					{
						id: 10409,
						name: 'Phường 14',
					},
					{
						id: 10410,
						name: 'Phường 15',
					},
					{
						id: 10411,
						name: 'Phường 16',
					}
				]
			},
			{
				id: 495,
				name: 'Quận 12',
				wards: [
					{
						id: 10420,
						name: 'Phường An Phú Đông',
					},
					{
						id: 10421,
						name: 'Phường Đông Hưng Thuận',
					},
					{
						id: 10422,
						name: 'Phường Hiệp Thành',
					},
					{
						id: 10423,
						name: 'Phường Tân Chánh Hiệp',
					},
					{
						id: 10424,
						name: 'Phường Tân Hưng Thuận',
					},
					{
						id: 10425,
						name: 'Phường Tân Thới Hiệp',
					},
					{
						id: 10426,
						name: 'Phường Tân Thới Nhất',
					},
					{
						id: 10427,
						name: 'Phường Thạnh Lộc',
					},
					{
						id: 10428,
						name: 'Phường Thạnh Xuân',
					},
					{
						id: 10429,
						name: 'Phường Thới An',
					},
					{
						id: 10430,
						name: 'Phường Trung Mỹ Tây',
					}
				]
			},
			{
				id: 496,
				name: 'Quận Bình Tân',
				wards: [
					{
						id: 10539,
						name: 'Phường An Lạc',
					},
					{
						id: 10540,
						name: 'Phường An Lạc A',
					},
					{
						id: 10541,
						name: 'Phường Bình Hưng Hòa',
					},
					{
						id: 10542,
						name: 'Phường Bình Hưng Hoà A',
					},
					{
						id: 10543,
						name: 'Phường Bình Hưng Hoà B',
					},
					{
						id: 10544,
						name: 'Phường Bình Trị Đông',
					},
					{
						id: 10545,
						name: 'Phường Bình Trị Đông A',
					},
					{
						id: 10546,
						name: 'Phường Bình Trị Đông B',
					},
					{
						id: 10547,
						name: 'Phường Tân Tạo',
					},
					{
						id: 10548,
						name: 'Phường Tân Tạo A',
					}
				]
			},
			{
				id: 497,
				name: 'Quận Bình Thạnh',
				wards: [
					{
						id: 10549,
						name: 'Phường 01',
					},
					{
						id: 10557,
						name: 'Phường 02',
					},
					{
						id: 10565,
						name: 'Phường 03',
					},
					{
						id: 10566,
						name: 'Phường 05',
					},
					{
						id: 10567,
						name: 'Phường 06',
					},
					{
						id: 10568,
						name: 'Phường 07',
					},
					{
						id: 10550,
						name: 'Phường 11',
					},
					{
						id: 10551,
						name: 'Phường 12',
					},
					{
						id: 10552,
						name: 'Phường 13',
					},
					{
						id: 10553,
						name: 'Phường 14',
					},
					{
						id: 10554,
						name: 'Phường 15',
					},
					{
						id: 10555,
						name: 'Phường 17',
					},
					{
						id: 10556,
						name: 'Phường 19',
					},
					{
						id: 10558,
						name: 'Phường 21',
					},
					{
						id: 10559,
						name: 'Phường 22',
					},
					{
						id: 10560,
						name: 'Phường 24',
					},
					{
						id: 10561,
						name: 'Phường 25',
					},
					{
						id: 10562,
						name: 'Phường 26',
					},
					{
						id: 10563,
						name: 'Phường 27',
					},
					{
						id: 10564,
						name: 'Phường 28',
					}
				]
			},
			{
				id: 498,
				name: 'Quận Gò Vấp',
				wards: [
					{
						id: 10569,
						name: 'Phường 01',
					},
					{
						id: 10578,
						name: 'Phường 03',
					},
					{
						id: 10579,
						name: 'Phường 04',
					},
					{
						id: 10580,
						name: 'Phường 05',
					},
					{
						id: 10581,
						name: 'Phường 06',
					},
					{
						id: 10582,
						name: 'Phường 07',
					},
					{
						id: 10583,
						name: 'Phường 08',
					},
					{
						id: 10584,
						name: 'Phường 09',
					},
					{
						id: 10570,
						name: 'Phường 10',
					},
					{
						id: 10571,
						name: 'Phường 11',
					},
					{
						id: 10572,
						name: 'Phường 12',
					},
					{
						id: 10573,
						name: 'Phường 13',
					},
					{
						id: 10574,
						name: 'Phường 14',
					},
					{
						id: 10575,
						name: 'Phường 15',
					},
					{
						id: 10576,
						name: 'Phường 16',
					},
					{
						id: 10577,
						name: 'Phường 17',
					}
				]
			},
			{
				id: 499,
				name: 'Quận Phú Nhuận',
				wards: [
					{
						id: 10585,
						name: 'Phường 01',
					},
					{
						id: 10586,
						name: 'Phường 02',
					},
					{
						id: 10587,
						name: 'Phường 03',
					},
					{
						id: 10588,
						name: 'Phường 04',
					},
					{
						id: 10589,
						name: 'Phường 05',
					},
					{
						id: 10590,
						name: 'Phường 07',
					},
					{
						id: 10591,
						name: 'Phường 08',
					},
					{
						id: 10592,
						name: 'Phường 09',
					},
					{
						id: 10593,
						name: 'Phường 10',
					},
					{
						id: 10594,
						name: 'Phường 11',
					},
					{
						id: 10595,
						name: 'Phường 12',
					},
					{
						id: 10596,
						name: 'Phường 13',
					},
					{
						id: 10597,
						name: 'Phường 14',
					},
					{
						id: 10598,
						name: 'Phường 15',
					},
					{
						id: 10599,
						name: 'Phường 17',
					}
				]
			},
			{
				id: 500,
				name: 'Quận Tân Bình',
				wards: [
					{
						id: 10600,
						name: 'Phường 01',
					},
					{
						id: 10607,
						name: 'Phường 02',
					},
					{
						id: 10608,
						name: 'Phường 03',
					},
					{
						id: 10609,
						name: 'Phường 04',
					},
					{
						id: 10610,
						name: 'Phường 05',
					},
					{
						id: 10611,
						name: 'Phường 06',
					},
					{
						id: 10612,
						name: 'Phường 07',
					},
					{
						id: 10613,
						name: 'Phường 08',
					},
					{
						id: 10614,
						name: 'Phường 09',
					},
					{
						id: 10601,
						name: 'Phường 10',
					},
					{
						id: 10602,
						name: 'Phường 11',
					},
					{
						id: 10603,
						name: 'Phường 12',
					},
					{
						id: 10604,
						name: 'Phường 13',
					},
					{
						id: 10605,
						name: 'Phường 14',
					},
					{
						id: 10606,
						name: 'Phường 15',
					}
				]
			},
			{
				id: 501,
				name: 'Quận Tân Phú',
				wards: [
					{
						id: 10615,
						name: 'Phường Hiệp Tân',
					},
					{
						id: 10616,
						name: 'Phường Hòa Thạnh',
					},
					{
						id: 10617,
						name: 'Phường Phú Thạnh',
					},
					{
						id: 10618,
						name: 'Phường Phú Thọ Hòa',
					},
					{
						id: 10619,
						name: 'Phường Phú Trung',
					},
					{
						id: 10620,
						name: 'Phường Sơn Kỳ',
					},
					{
						id: 10621,
						name: 'Phường Tân Quý',
					},
					{
						id: 10622,
						name: 'Phường Tân Sơn Nhì',
					},
					{
						id: 10623,
						name: 'Phường Tân Thành',
					},
					{
						id: 10624,
						name: 'Phường Tân Thới Hòa',
					},
					{
						id: 10625,
						name: 'Phường Tây Thạnh',
					}
				]
			},
			{
				id: 502,
				name: 'Quận Thủ Đức - TP Thủ Đức',
				wards: [
					{
						id: 10626,
						name: 'Phường Bình Chiểu',
					},
					{
						id: 10627,
						name: 'Phường Bình Thọ',
					},
					{
						id: 10628,
						name: 'Phường Hiệp Bình Chánh',
					},
					{
						id: 10629,
						name: 'Phường Hiệp Bình Phước',
					},
					{
						id: 10630,
						name: 'Phường Linh Chiểu',
					},
					{
						id: 10631,
						name: 'Phường Linh Đông',
					},
					{
						id: 10632,
						name: 'Phường Linh Tây',
					},
					{
						id: 10633,
						name: 'Phường Linh Trung',
					},
					{
						id: 10634,
						name: 'Phường Linh Xuân',
					},
					{
						id: 10635,
						name: 'Phường Tam Bình',
					},
					{
						id: 10636,
						name: 'Phường Tam Phú',
					},
					{
						id: 10637,
						name: 'Phường Trường Thọ',
					}
				]
			},
			{
				id: 503,
				name: 'Huyện Bình Chánh',
				wards: [
					{
						id: 10316,
						name: 'Thị trấn Tân Túc',
					},
					{
						id: 10317,
						name: 'Xã An Phú Tây',
					},
					{
						id: 10318,
						name: 'Xã Bình Chánh',
					},
					{
						id: 10319,
						name: 'Xã Bình Hưng',
					},
					{
						id: 10320,
						name: 'Xã Bình Lợi',
					},
					{
						id: 10321,
						name: 'Xã Đa Phước',
					},
					{
						id: 10322,
						name: 'Xã Hưng Long',
					},
					{
						id: 10323,
						name: 'Xã Lê Minh Xuân',
					},
					{
						id: 10324,
						name: 'Xã Phạm Văn Hai',
					},
					{
						id: 10325,
						name: 'Xã Phong Phú',
					},
					{
						id: 10326,
						name: 'Xã Quy Đức',
					},
					{
						id: 10327,
						name: 'Xã Tân Kiên',
					},
					{
						id: 10328,
						name: 'Xã Tân Nhựt',
					},
					{
						id: 10329,
						name: 'Xã Tân Quý Tây',
					},
					{
						id: 10330,
						name: 'Xã Vĩnh Lộc A',
					},
					{
						id: 10331,
						name: 'Xã Vĩnh Lộc B',
					}
				]
			},
			{
				id: 504,
				name: 'Huyện Cần Giờ',
				wards: [
					{
						id: 10332,
						name: 'Thị trấn Cần Thạnh',
					},
					{
						id: 10333,
						name: 'Xã An Thới Đông',
					},
					{
						id: 10334,
						name: 'Xã Bình Khánh',
					},
					{
						id: 10335,
						name: 'Xã Long Hòa',
					},
					{
						id: 10336,
						name: 'Xã Lý Nhơn',
					},
					{
						id: 10337,
						name: 'Xã Tam Thôn Hiệp',
					},
					{
						id: 10338,
						name: 'Xã Thạnh An',
					}
				]
			},
			{
				id: 505,
				name: 'Huyện Củ Chi',
				wards: [
					{
						id: 10347,
						name: 'Thị trấn Củ Chi',
					},
					{
						id: 10353,
						name: 'Xã An Nhơn Tây',
					},
					{
						id: 10357,
						name: 'Xã An Phú',
					},
					{
						id: 10349,
						name: 'Xã Bình Mỹ',
					},
					{
						id: 10342,
						name: 'Xã Hòa Phú',
					},
					{
						id: 10348,
						name: 'Xã Nhuận Đức',
					},
					{
						id: 10356,
						name: 'Xã Phạm Văn Cội',
					},
					{
						id: 10340,
						name: 'Xã Phú Hòa Đông',
					},
					{
						id: 10341,
						name: 'Xã Phú Mỹ Hưng',
					},
					{
						id: 10358,
						name: 'Xã Phước Hiệp',
					},
					{
						id: 10354,
						name: 'Xã Phước Thạnh',
					},
					{
						id: 10355,
						name: 'Xã Phước Vĩnh An',
					},
					{
						id: 10339,
						name: 'Xã Tân An Hội',
					},
					{
						id: 10343,
						name: 'Xã Tân Phú Trung',
					},
					{
						id: 10344,
						name: 'Xã Tân Thạnh Đông',
					},
					{
						id: 10345,
						name: 'Xã Tân Thạnh Tây',
					},
					{
						id: 10346,
						name: 'Xã Tân Thông Hội',
					},
					{
						id: 10350,
						name: 'Xã Thái Mỹ',
					},
					{
						id: 10351,
						name: 'Xã Trung An',
					},
					{
						id: 10359,
						name: 'Xã Trung Lập Hạ',
					},
					{
						id: 10352,
						name: 'Xã Trung Lập Thượng',
					}
				]
			},
			{
				id: 506,
				name: 'Huyện Hóc Môn',
				wards: [
					{
						id: 10360,
						name: 'Thị trấn Hóc Môn',
					},
					{
						id: 10361,
						name: 'Xã Bà Điểm',
					},
					{
						id: 10362,
						name: 'Xã Đông Thạnh',
					},
					{
						id: 10363,
						name: 'Xã Nhị Bình',
					},
					{
						id: 10364,
						name: 'Xã Tân Hiệp',
					},
					{
						id: 10365,
						name: 'Xã Tân Thới Nhì',
					},
					{
						id: 10366,
						name: 'Xã Tân Xuân',
					},
					{
						id: 10367,
						name: 'Xã Thới Tam Thôn',
					},
					{
						id: 10368,
						name: 'Xã Trung Chánh',
					},
					{
						id: 10369,
						name: 'Xã Xuân Thới Đông',
					},
					{
						id: 10370,
						name: 'Xã Xuân Thới Sơn',
					},
					{
						id: 10371,
						name: 'Xã Xuân Thới Thượng',
					}
				]
			},
			{
				id: 507,
				name: 'Huyện Nhà Bè',
				wards: [
					{
						id: 10372,
						name: 'Thị trấn Nhà Bè',
					},
					{
						id: 10373,
						name: 'Xã Hiệp Phước',
					},
					{
						id: 10374,
						name: 'Xã Long Thới',
					},
					{
						id: 10375,
						name: 'Xã Nhơn Đức',
					},
					{
						id: 10376,
						name: 'Xã Phú Xuân',
					},
					{
						id: 10377,
						name: 'Xã Phước Kiển',
					},
					{
						id: 10378,
						name: 'Xã Phước Lộc',
					}
				]
			}
		]
	},
	{
		name: 'Hà Nội',
		id: 2,
		districts: [
			{
				id: 1,
				name: 'Quận Ba Đình',
			},
			{
				id: 10,
				name: 'Quận Hoàn Kiếm',
			},
			{
				id: 11,
				name: 'Quận Hai Bà Trưng',
			},
			{
				id: 12,
				name: 'Quận Đống Đa',
			},
			{
				id: 13,
				name: 'Quận Cầu Giấy',
			},
			{
				id: 14,
				name: 'Quận Long Biên',
			},
			{
				id: 2,
				name: 'Quận Hoàng Mai',
			},
			{
				id: 3,
				name: 'Huyện Sóc Sơn',
			},
			{
				id: 4,
				name: 'Quận Bắc Từ Liêm',
			},
			{
				id: 5,
				name: 'Huyện Thanh Trì',
			},
			{
				id: 6,
				name: 'Huyện Gia Lâm',
			},
			{
				id: 676,
				name: 'Huyện Ba Vì',
			},
			{
				id: 677,
				name: 'Huyện Chương Mỹ',
			},
			{
				id: 678,
				name: 'Huyện Đan Phượng',
			},
			{
				id: 679,
				name: 'Huyện Hoài Đức',
			},
			{
				id: 680,
				name: 'Huyện Mỹ Đức',
			},
			{
				id: 681,
				name: 'Huyện Phú Xuyên',
			},
			{
				id: 682,
				name: 'Huyện Phúc Thọ',
			},
			{
				id: 683,
				name: 'Huyện Quốc Oai',
			},
			{
				id: 684,
				name: 'Huyện Thạch Thất',
			},
			{
				id: 685,
				name: 'Huyện Thanh Oai',
			},
			{
				id: 686,
				name: 'Huyện Thường Tín',
			},
			{
				id: 687,
				name: 'Huyện Ứng Hòa',
			},
			{
				id: 688,
				name: 'Huyện Mê Linh',
			},
			{
				id: 689,
				name: 'Quận Hà Đông',
			},
			{
				id: 690,
				name: 'Thị xã Sơn Tây',
			},
			{
				id: 7,
				name: 'Huyện Đông Anh',
			},
			{
				id: 724,
				name: 'Quận Nam Từ Liêm',
			},
			{
				id: 8,
				name: 'Quận Thanh Xuân',
			},
			{
				id: 9,
				name: 'Quận Tây Hồ',
			}
		]
	},
	{
		name: 'Đà Nẵng',
		id: 3,
		districts: [
			{
				id: 371,
				name: 'Huyện Hoàng Sa',
			},
			{
				id: 372,
				name: 'Quận Thanh Khê',
			},
			{
				id: 373,
				name: 'Huyện Hòa Vang',
			},
			{
				id: 374,
				name: 'Quận Sơn Trà',
			},
			{
				id: 375,
				name: 'Quận Liên Chiểu',
			},
			{
				id: 376,
				name: 'Quận Hải Châu',
			},
			{
				id: 377,
				name: 'Quận Cẩm Lệ',
			},
			{
				id: 378,
				name: 'Quận Ngũ Hành Sơn',
			}
		]
	},
	{
		name: 'An Giang',
		id: 4,
	},
	{
		name: 'Bà Rịa - Vũng Tàu',
		id: 5,
	},
	{
		name: 'Bắc Giang',
		id: 6,
	},
	{
		name: 'Bắc Kạn',
		id: 7,
	},
	{
		name: 'Bạc Liêu',
		id: 8,
	},
	{
		name: 'Bắc Ninh',
		id: 9,
	},
	{
		name: 'Bến Tre',
		id: 10,
	},
	{
		name: 'Bình Dương',
		id: 11,
	},
	{
		name: 'Bình Phước',
		id: 12,
	},
	{
		name: 'Bình Thuận',
		id: 13,
	},
	{
		name: 'Bình Định',
		id: 14,
	},
	{
		name: 'Cà Mau',
		id: 15,
	},
	{
		name: 'Cần Thơ',
		id: 16,
	},
	{
		name: 'Cao Bằng',
		id: 17,
	},
	{
		name: 'Gia Lai',
		id: 18,
	},
	{
		name: 'Hà Giang',
		id: 19,
	},
	{
		name: 'Hà Nam',
		id: 20,
	},
	{
		name: 'Hà Tĩnh',
		id: 21,
	},
	{
		name: 'Hải Dương',
		id: 22,
	},
	{
		name: 'Hải Phòng',
		id: 23,
	},
	{
		name: 'Hậu Giang',
		id: 24,
	},
	{
		name: 'Hoà Bình',
		id: 25,
	},
	{
		name: 'Hưng Yên',
		id: 26,
	},
	{
		name: 'Khánh Hòa',
		id: 27,
	},
	{
		name: 'Kiên Giang',
		id: 28,
	},
	{
		name: 'Kon Tum',
		id: 29,
	},
	{
		name: 'Lai Châu',
		id: 30,
	},
	{
		name: 'Lâm Đồng',
		id: 31,
	},
	{
		name: 'Lạng Sơn',
		id: 32,
	},
	{
		name: 'Lào Cai',
		id: 33,
	},
	{
		name: 'Long An',
		id: 34,
	},
	{
		name: 'Nam Định',
		id: 35,
	},
	{
		name: 'Nghệ An',
		id: 36,
	},
	{
		name: 'Ninh Bình',
		id: 37,
	},
	{
		name: 'Ninh Thuận',
		id: 38,
	},
	{
		name: 'Phú Thọ',
		id: 39,
	},
	{
		name: 'Phú Yên',
		id: 40,
	},
	{
		name: 'Quảng Bình',
		id: 41,
	},
	{
		name: 'Quảng Nam',
		id: 42,
	},
	{
		name: 'Quảng Ngãi',
		id: 43,
	},
	{
		name: 'Quảng Ninh',
		id: 44,
	},
	{
		name: 'Quảng Trị',
		id: 45,
	},
	{
		name: 'Sóc Trăng',
		id: 46,
	},
	{
		name: 'Sơn La',
		id: 47,
	},
	{
		name: 'Tây Ninh',
		id: 48,
	},
	{
		name: 'Thái Bình',
		id: 49,
	},
	{
		name: 'Thái Nguyên',
		id: 50,
	},
	{
		name: 'Thanh Hóa',
		id: 51,
	},
	{
		name: 'Thừa Thiên Huế',
		id: 52,
	},
	{
		name: 'Tiền Giang',
		id: 53,
	},
	{
		name: 'Trà Vinh',
		id: 54,
	},
	{
		name: 'Tuyên Quang',
		id: 55,
	},
	{
		name: 'Vĩnh Long',
		id: 56,
	},
	{
		name: 'Vĩnh Phúc',
		id: 57,
	},
	{
		name: 'Yên Bái',
		id: 58,
	},
	{
		name: 'Đắk Lắk',
		id: 59,
	},
	{
		name: 'Đắk Nông',
		id: 60,
	},
	{
		name: 'Điện Biên',
		id: 61,
	},
	{
		name: 'Đồng Nai',
		id: 62,
	},
	{
		name: 'Đồng Tháp',
		id: 63,
	},
];

async function main() {
	// Use connect method to connect to the server
	const db = client.db();
	const myCollection = db.collection('provinces');
	const insertResult = await myCollection.insertMany(data);

	console.log('Inserted documents =>', insertResult);

	return 'DONE.';
}

main()
	.then(console.log)
	.catch(console.error)
	.finally(() => client.close());
