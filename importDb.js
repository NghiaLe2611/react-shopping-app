import { MongoClient } from 'mongodb';

// Connection URL
const client = await MongoClient.connect(
	'mongodb+srv://nghia:26111994@cluster0.io0lf.mongodb.net/react-db?retryWrites=true&w=majority'
);

const products = [
	
];

let reviews = [
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
	const myCollection = db.collection('reviews');
	const insertResult = await myCollection.insertMany(reviews);

	console.log('Inserted documents =>', insertResult);

	return 'DONE.';
}

main()
	.then(console.log)
	.catch(console.error)
	.finally(() => client.close());
