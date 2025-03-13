import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db"; // Dein Prisma Client
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // WICHTIG: Niemals im Frontend verwenden!
);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if(authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }


  const now = new Date();

  const expiredDocs = await db.document.findMany({
    where: { expires_at: { lt: now } },
  });

  if (expiredDocs.length === 0) {
    return NextResponse.json({ message: "Keine abgelaufenen PDFs gefunden." });
  }

  //Dateien aus Supabase Storage löschen
  for (const doc of expiredDocs) {
    const { error } = await supabase.storage.from("pdf").remove([doc.storagepath]);

    if (error) {
      console.error(`Fehler beim Löschen von ${doc.storagepath}:`, error);
    } else {
      await db.document.delete({ where: { id: doc.id } });
    }
  }

  return NextResponse.json({ message: `Gelöscht: ${expiredDocs.length} PDFs` });
}