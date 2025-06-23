import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    challengeOptionId: string;
  };
};

export const GET = async (
  req: NextRequest,
  { params }: Context
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const challengeOptionId = parseInt(params.challengeOptionId, 10);

  const data = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, challengeOptionId),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: Context
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const challengeOptionId = parseInt(params.challengeOptionId, 10);
  const body = await req.json();

  const data = await db.update(challengeOptions)
    .set({
      ...body,
    })
    .where(eq(challengeOptions.id, challengeOptionId))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  req: NextRequest,
  { params }: Context
) => {
  if (!isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const challengeOptionId = parseInt(params.challengeOptionId, 10);

  const data = await db.delete(challengeOptions)
    .where(eq(challengeOptions.id, challengeOptionId))
    .returning();

  return NextResponse.json(data[0]);
};
