import { MongoClient } from 'mongodb';

// Connection URL
const client = await MongoClient.connect(
	'mongodb+srv://nghia:26111994@cluster0.io0lf.mongodb.net/react-db?retryWrites=true&w=majority'
);

const products = [
	
];

const reviews = [
	{
        productId: "61ca76613e6bc936ad503fe9",
        star: 5,
        comment: "Nhỏ gọn mà mạnh mẽ, Xperia 5 III kết hợp tốc độ AF vượt trội của model tiền nhiệm với hệ thống quang học mới lên tới 105 mm. Từ chụp ảnh đến chơi game, đây là điện thoại thông minh vừa tay, vượt xa mong đợi của bạn."
    }
];

let reviews1 = [
	{
		productId: '123',
		reviews: [
			{
				customerName: 'abc',
				star: 5,
				comment: 'lorem lorem 1'
			},
			{
				customerName: 'def',
				star: 3,
				comment: 'lorem lorem 2'
			},
			{
				customerName: 'ghi',
				star: 2,
				comment: 'lorem lorem 3'
			}
		]
	},
	{
		productId: '456',
		reviews: [
			{
				customerName: 'abc',
				star: 5,
				comment: 'lorem lorem 1'
			},
			{
				customerName: 'def',
				star: 3,
				comment: 'lorem lorem 2'
			},
			{
				customerName: 'ghi',
				star: 2,
				comment: 'lorem lorem 3'
			}
		]
	}
]

async function main() {
	// Use connect method to connect to the server
	const db = client.db();
	const myCollection = db.collection('reviews1');
	const insertResult = await myCollection.insertMany(reviews1);

	console.log('Inserted documents =>', insertResult);

	return 'DONE.';
}

main()
	.then(console.log)
	.catch(console.error)
	.finally(() => client.close());
