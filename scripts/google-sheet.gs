/**
 * CFO 4.0 — receives form submissions from the site and appends them to this Google Sheet.
 *
 * Setup (once):
 * 1. Create a Google Sheet, then Extensions → Apps Script, paste this file, save.
 * 2. Project settings → Script properties → add SECRET = a long random string.
 * 3. Deploy → New deployment → type "Web app"; Execute as: Me; Who has access: Anyone → Deploy.
 * 4. On the server set SHEETS_WEBHOOK_URL = the web app URL (…/exec)
 *    and SHEETS_WEBHOOK_SECRET = the same SECRET, then restart the site.
 *
 * Each form type gets its own tab (Candidature, Rappel, Session, Document).
 * New columns are added automatically if the form gains a field.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var payload = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (!secret || payload.secret !== secret) return reply({ ok: false, error: "unauthorized" });

    var name = String(payload.sheet || "Formulaires").slice(0, 60);
    var row = payload.row || {};
    var book = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = book.getSheetByName(name) || book.insertSheet(name);

    var keys = Object.keys(row);
    var headers = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    keys.forEach(function (k) {
      if (headers.indexOf(k) === -1) headers.push(k);
    });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);

    var values = headers.map(function (h) {
      var v = row[h] == null ? "" : String(row[h]);
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    });
    sheet.appendRow(values);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
