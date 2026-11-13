/**
 * Festa do Fim do Mundo — recebe as confirmações do site e grava na planilha.
 *
 * Como instalar:
 * 1. Crie uma planilha no Google Sheets.
 * 2. Extensões > Apps Script. Apague o que tiver e cole este arquivo inteiro.
 * 3. Troque o SECRET abaixo por uma senha sua (a mesma vai no APPS_SCRIPT_SECRET da Vercel).
 *    Opcional: cole em SPREADSHEET_ID o ID da planilha (o trecho da URL entre /d/ e /edit).
 * 4. Implantar > Nova implantação > tipo "App da Web":
 *      - Executar como: Eu
 *      - Quem pode acessar: Qualquer pessoa
 * 5. Autorize, copie a URL que termina em /exec e coloque no APPS_SCRIPT_URL da Vercel.
 *
 * Se mudar este código depois: Implantar > Gerenciar implantações > editar > Nova versão
 * (assim a URL continua a mesma).
 *
 * Conferir onde está gravando: abra no navegador  <URL /exec>?secret=SUA_SENHA
 * A resposta mostra o nome da planilha, a aba e quantas confirmações ela tem.
 */

const SECRET = "TROQUE-POR-UMA-SENHA";
// ID da planilha: docs.google.com/spreadsheets/d/<ESTE TRECHO>/edit (opcional)
const SPREADSHEET_ID = "COLE-O-ID-DA-PLANILHA";
const SHEET_NAME = "Confirmações";
const HEADERS = ["Confirmado em", "Nome/Vulgo", "WhatsApp", "Atualizado em"];
const COL_NAME = 2;
const COL_WHATSAPP = 3;
const COL_UPDATED = 4;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // evita duas confirmações gravando na mesma linha ao mesmo tempo

  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (data.secret !== SECRET) return json({ ok: false, error: "não autorizado" });

    const name = String(data.name || "").trim().slice(0, 80);
    const whatsapp = String(data.whatsapp || "").trim().slice(0, 30);
    if (!name || digits(whatsapp).length < 10) {
      return json({ ok: false, error: "dados inválidos" });
    }

    const sheet = getSheet();
    const now = new Date();

    // Mesmo WhatsApp de novo: atualiza o nome em vez de duplicar a linha
    const existing = findRowByWhatsapp(sheet, whatsapp);
    if (existing) {
      sheet.getRange(existing, COL_NAME).setValue(name);
      sheet.getRange(existing, COL_UPDATED).setValue(now);
    } else {
      sheet.appendRow([now, name, whatsapp, ""]);
    }

    return json({ ok: true, planilha: sheet.getParent().getName(), aba: SHEET_NAME });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Checagem rápida no navegador: <URL /exec>?secret=SUA_SENHA */
function doGet(e) {
  if (!e || !e.parameter || e.parameter.secret !== SECRET) {
    return json({ ok: false, error: "não autorizado" });
  }
  try {
    const sheet = getSheet();
    return json({
      ok: true,
      planilha: sheet.getParent().getName(),
      aba: SHEET_NAME,
      confirmacoes: Math.max(sheet.getLastRow() - 1, 0),
    });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function getSheet() {
  const hasId = SPREADSHEET_ID && SPREADSHEET_ID.indexOf("COLE-O-ID") !== 0;
  const ss = hasId
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Planilha não encontrada: preencha SPREADSHEET_ID no Code.gs");

  let sheet = ss.getSheetByName(SHEET_NAME);

  // Aba no formato antigo (com e-mail e checkboxes): guarda com outro nome e começa uma nova
  if (sheet && sheet.getRange(1, COL_WHATSAPP).getValue() !== "WhatsApp") {
    sheet.setName(SHEET_NAME + " (antigo)");
    sheet = null;
  }

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function findRowByWhatsapp(sheet, whatsapp) {
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const target = digits(whatsapp);
  const values = sheet.getRange(2, COL_WHATSAPP, last - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (digits(values[i][0]) === target) return i + 2;
  }
  return null;
}

function digits(value) {
  return String(value || "").replace(/\D/g, "");
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
