import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// Initialize the database table if it doesn't exist
const initDb = async () => {
    try {
        await sql(`
            CREATE TABLE IF NOT EXISTS guestbook_dhisa (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                message TEXT NOT NULL,
                attending BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export async function GET() {
    try {
        await initDb();
        const result = await sql`SELECT * FROM guestbook_dhisa ORDER BY created_at DESC;`;
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error fetching guestbook:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await initDb();
        const { name, message, attending } = await request.json();

        if (!name || !message) {
            return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
        }

        const result = await sql`
            INSERT INTO guestbook_dhisa (name, message, attending)
            VALUES (${name}, ${message}, ${attending})
            RETURNING *;
        `;

        return NextResponse.json(result[0], { status: 201 });
    } catch (error: any) {
        console.error('Error saving guestbook entry:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
