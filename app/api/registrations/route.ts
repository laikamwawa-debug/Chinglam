import { desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { registrations } from "../../../db/schema";

const allowedCourses = new Set([
  "SEN 小組體適能訓練",
  "專注力 × 運動訓練",
  "社交 × 團隊運動",
  "個別 1:1 運動訓練",
]);

const allowedAvailability = new Set([
  "平日早上",
  "平日下午",
  "平日晚上",
  "星期六日",
]);

const allowedStatuses = new Set(["new", "contacted", "assessment", "enrolled", "closed"]);

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isAdminRequest(request: Request) {
  // Local previews stay convenient for the site owner. Production requests
  // must come from the signed-in Sites owner or include a server-side key.
  if (process.env.NODE_ENV !== "production") return true;

  const configuredKey = process.env.ADMIN_ACCESS_KEY?.trim();
  const suppliedKey = request.headers.get("x-admin-key")?.trim();
  if (configuredKey && suppliedKey && configuredKey === suppliedKey) return true;

  const host = request.headers.get("host") ?? "";
  const signedInUser = request.headers.get("oai-authenticated-user-id");
  return Boolean(signedInUser && host.endsWith(".chatgpt.site"));
}

function routeError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("no such table") || message.includes("registrations")) {
    return "報名資料庫尚未啟用，請先完成網站部署，系統會自動建立資料表。";
  }
  return "系統暫時未能處理，請稍後再試。";
}

async function ensureTable() {
  if (!env.DB) return;
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS registrations (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, parent_name TEXT NOT NULL, child_name TEXT NOT NULL, child_age INTEGER NOT NULL, contact_phone TEXT NOT NULL, contact_email TEXT, course TEXT NOT NULL, availability TEXT NOT NULL, support_needs TEXT, message TEXT, consent INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at)"),
  ]);
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "需要管理員權限" }, { status: 401 });
  }

  try {
    await ensureTable();
    const db = getDb();
    const rows = await db
      .select()
      .from(registrations)
      .orderBy(desc(registrations.createdAt), desc(registrations.id))
      .limit(250);

    const stats = rows.reduce(
      (summary, row) => {
        summary.total += 1;
        summary[row.status as keyof typeof summary] =
          (summary[row.status as keyof typeof summary] as number) + 1;
        return summary;
      },
      { total: 0, new: 0, contacted: 0, assessment: 0, enrolled: 0, closed: 0 }
    );

    return Response.json({ registrations: rows, stats });
  } catch (error) {
    return Response.json({ error: routeError(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const payload = (await request.json()) as Record<string, unknown>;
    // Honeypot field catches simple bots without adding a CAPTCHA burden for parents.
    if (clean(payload.website, 80)) return Response.json({ ok: true }, { status: 201 });

    const parentName = clean(payload.parentName, 80);
    const childName = clean(payload.childName, 80);
    const childAge = Number(payload.childAge);
    const contactPhone = clean(payload.contactPhone, 40);
    const contactEmail = clean(payload.contactEmail, 120);
    const course = clean(payload.course, 80);
    const availability = clean(payload.availability, 40);
    const supportNeeds = clean(payload.supportNeeds, 600);
    const message = clean(payload.message, 800);
    const consent = payload.consent === true;

    if (!parentName || !childName || !contactPhone || !course || !availability) {
      return Response.json({ error: "請填寫所有必填欄位。" }, { status: 400 });
    }
    if (!Number.isInteger(childAge) || childAge < 4 || childAge > 18) {
      return Response.json({ error: "請選擇孩子年齡（4–18 歲）。" }, { status: 400 });
    }
    if (!allowedCourses.has(course) || !allowedAvailability.has(availability)) {
      return Response.json({ error: "請選擇有效的課程及時段。" }, { status: 400 });
    }
    if (!consent) {
      return Response.json({ error: "請先同意我們使用資料作聯絡及安排課程。" }, { status: 400 });
    }

    const db = getDb();
    const [registration] = await db
      .insert(registrations)
      .values({
        parentName,
        childName,
        childAge,
        contactPhone,
        contactEmail: contactEmail || null,
        course,
        availability,
        supportNeeds: supportNeeds || null,
        message: message || null,
        consent: true,
      })
      .returning();

    return Response.json({ registration }, { status: 201 });
  } catch (error) {
    return Response.json({ error: routeError(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "需要管理員權限" }, { status: 401 });
  }

  try {
    await ensureTable();
    const payload = (await request.json()) as Record<string, unknown>;
    const id = Number(payload.id);
    const status = clean(payload.status, 24);
    if (!Number.isInteger(id) || id < 1 || !allowedStatuses.has(status)) {
      return Response.json({ error: "無效的報名狀態。" }, { status: 400 });
    }

    const db = getDb();
    const [registration] = await db
      .update(registrations)
      .set({ status, updatedAt: new Date().toISOString() })
      .where(eq(registrations.id, id))
      .returning();

    if (!registration) return Response.json({ error: "找不到這份報名資料。" }, { status: 404 });
    return Response.json({ registration });
  } catch (error) {
    return Response.json({ error: routeError(error) }, { status: 500 });
  }
}

