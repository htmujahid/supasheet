import { NextRequest, NextResponse } from "next/server";

import { processSql, renderHttp } from "@supabase/sql-to-rest";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    const statement = await processSql(query);
    const rendered = renderHttp(statement);

    return NextResponse.json({
      parsed: statement,
      statement,
      rendered,
    });
  } catch (error) {
    console.error("SQL parsing error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        parsed: null,
        statement: null,
        rendered: null,
      },
      { status: 500 },
    );
  }
}
