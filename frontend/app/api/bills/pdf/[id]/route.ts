// /app/api/bills/pdf/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";
import { generateBillPDFBuffer, PdfTheme } from "@/lib/pdf/billPdf";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const url = new URL(req.url);
  const themeParam = url.searchParams.get("theme") as PdfTheme | null;
  const theme: PdfTheme =
    themeParam === "blue" || themeParam === "green" ? themeParam : "modern";

  // fetch bill data from backend
  let bill: any = null;
  try {
    const res = await fetch(`${API_BASE}/api/purchases/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Bill fetch failed" },
        { status: res.status }
      );
    }

    bill = await res.json();
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bill from backend" },
      { status: 500 }
    );
  }

  if (!bill) {
    return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  }

  try {
    const pdfBuffer = await generateBillPDFBuffer(bill, theme);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Bill-${
          bill.billNo ?? id
        }.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation error", err);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 }
    );
  }
}
