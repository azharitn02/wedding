import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Initialize the database table if it doesn't exist 
let isDbInitialized = false;
let dbInitPromise: Promise<void> | null = null;

const initDb = async () => {
    if (isDbInitialized) return;
    if (dbInitPromise) return dbInitPromise;

    dbInitPromise = (async () => {
        try {
            await sql`
                CREATE TABLE IF NOT EXISTS guestbook_wedding_2 (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    message TEXT NOT NULL,
                    attending BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `;
            isDbInitialized = true;
        } catch (error) {
            console.error('Error initializing database:', error);
            dbInitPromise = null; // Reset to allow retry on next request if initialization failed
        }
    })();

    return dbInitPromise;
};

export async function GET(request: NextRequest) {
    // Access searchParams to dynamically make Next.js treat this route as runtime dynamic
    // without requiring "export const dynamic = 'force-dynamic'" which crashes static exports.
    const _forceDynamic = request.nextUrl.searchParams;
    
    try {
        await initDb();
        const result = await sql`SELECT * FROM guestbook_wedding_2 ORDER BY created_at DESC;`;
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error fetching guestbook:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await initDb();
        const { name, message, attending } = await request.json();

        if (!name || !message) {
            return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
        }

        const result = await sql`
            INSERT INTO guestbook_wedding_2 (name, message, attending)
            VALUES (${name}, ${message}, ${attending})
            RETURNING *;
        `;

        return NextResponse.json((result as any)[0], { status: 201 });
    } catch (error: any) {
        console.error('Error saving guestbook entry:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
