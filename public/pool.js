const { Pool } = require('pg')

const pool = new Pool({
	host: 'localhost',
	user: 'postgres',
	password: '1234',
	database: 'datame',
	port: 5432,
})

const query = async (SQL, ...params) => {

	const client = await pool.connect()

	try {
		const { rows } = await client.query(SQL, params.length ? params : null)

		return rows
	}
	catch(error) {
		throw error
	}
	finally {
		client.release()
	}
}

module.exports.query = query