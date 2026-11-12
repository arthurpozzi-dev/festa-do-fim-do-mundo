/**
 * Festa do Fim do Mundo — recebe as confirmações do site e grava na planilha.
 *
 * Como instalar:
 * 1. Crie uma planilha no Google Sheets.
 * 2. Extensões > Apps Script. Apague o que tiver e cole este arquivo inteiro.
 * 3. Troque o SECRET abaixo por uma senha sua (a mesma vai no APPS_SCRIPT_SECRET da Vercel).
 * 4. Implantar > Nova implantação > tipo "App da Web":
 *      - Executar como: Eu
 *      - Quem pode acessar: Qualquer pessoa
 * 5. Autorize, copie a URL que termina em /exec e coloque no APPS_SCRIPT_URL da Vercel.
 *
 * Se mudar este código depois: Implantar > Gerenciar implantações > editar > Nova versão
 * (assim a URL continua a mesma).
 */

const SECRET = "TROQUE-POR-UMA-SENHA";
const SHEET_NAME = "Confirmações";
const HEADERS = [
  "Confirmado em",
  "Nome/Vulgo",
  "E-mail",
  "Aceitou os termos",
  "Ligação com órgão governamental",
  "Atualizado em",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // evita duas confirmações gravando na mesma linha ao mesmo tempo

  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (data.secret !== SECRET) return json({ ok: false, error: "não autorizado" });

    const name = String(data.name || "").trim().slice(0, 80);
    const email = String(data.email || "").trim().toLowerCase().slice(0, 160);
    if (!name || !email || data.acceptedTerms !== true) {
      return json({ ok: false, error: "dados inválidos" });
    }

    const sheet = getSheet();
    const now = new Date();
    const row = [
      name,
      email,
      "Sim",
      data.governmentLink === true ? "Sim" : "Não",
    ];

    // Mesmo e-mail de novo: atualiza a linha em vez de duplicar
    const existing = findRowByEmail(sheet, email);
    if (existing) {
      sheet.getRange(existing, 2, 1, row.length).setValues([row]);
      sheet.getRange(existing, 6).setValue(now);
    } else {
      sheet.appendRow([now].concat(row).concat([""]));
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function findRowByEmail(sheet, email) {
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const emails = sheet.getRange(2, 3, last - 1, 1).getValues();
  for (let i = 0; i < emails.length; i++) {
    if (String(emails[i][0]).trim().toLowerCase() === email) return i + 2;
  }
  return null;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
