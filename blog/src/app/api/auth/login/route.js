import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // TODO: Implement login logic
        return NextResponse.json(
            { message: 'Login endpoint - not implemented yet' },
            { status: 501 }
        );
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json(
            { message: 'error in login', error: err.message },
            { status: 500 }
        );
    }
}
