// src/utils/accounting.js
import Account from "../models/Account.js";
import JournalEntry from "../models/JournalEntry.js";

/**
 * Get or create an account by code (simple helper).
 * Example default accounts:
 *  - PURCHASE_EXPENSE (expense)
 *  - GST_INPUT (asset)
 *  - SUPPLIER_<supplierId> (liability) — we will use supplier account code pattern
 *
 * For production you should seed accounts once and reference by id via settings.
 */
export async function getOrCreateAccount({ code, name, type }, session = null) {
  const q = Account.findOne({ code });
  if (session) q.session(session);
  let acc = await q.exec();
  if (!acc) {
    acc = await Account.create([{ code, name, type }], { session });
    acc = acc[0];
  }
  return acc;
}

/**
 * Create a JournalEntry with lines. Lines must balance (sum debit === sum credit)
 * lines = [{ accountId, debit, credit, narration }]
 */
export async function createJournalEntry(
  {
    voucherNo,
    date = new Date(),
    lines = [],
    refType = null,
    refId = null,
    createdBy = null,
  },
  session = null
) {
  // basic validation
  const debit = lines.reduce((s, l) => s + (l.debit || 0), 0);
  const credit = lines.reduce((s, l) => s + (l.credit || 0), 0);
  if (Math.abs(debit - credit) > 0.0001) {
    throw new Error(
      `Journal entry not balanced. Debit=${debit} Credit=${credit}`
    );
  }

  const doc = await JournalEntry.create(
    [
      {
        voucherNo,
        date,
        lines: lines.map((l) => ({
          account: l.accountId,
          debit: l.debit || 0,
          credit: l.credit || 0,
          narration: l.narration || "",
        })),
        refType,
        refId,
        createdBy,
      },
    ],
    { session }
  );

  // Optionally update cached balances per account (simple)
  for (const l of lines) {
    if (!l.accountId) continue;
    const acc = await Account.findById(l.accountId).session(session);
    if (!acc) continue;
    acc.balance = (acc.balance || 0) + ((l.debit || 0) - (l.credit || 0));
    await acc.save({ session });
  }

  return doc[0];
}
