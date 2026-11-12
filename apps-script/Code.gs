/**
 * Festa do Fim do Mundo — recebe as confirmações do site e grava na planilha.
 *
 * Como instalar:
 * 1. Crie uma planilha no Google Sheets.
 * 2. Extensões > Apps Script. Apague o que tiver e cole este arquivo inteiro.
 * 3. Troque o SECRET abaixo por uma senha sua (a mesma vai no APPS_SCRIPT_SECRET da Vercel)
 *    e cole em SPREADSHEET_ID o ID da planilha (o trecho da URL entre /d/ e /edit).
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
// ID da planilha: docs.google.com/spreadsheets/d/<ESTE TRECHO>/edit
const SPREADSHEET_ID = "COLE-O-ID-DA-PLANILHA";
const SHEET_NAME = "Confirmações";
const HEADERS = [
  "Confirmado em",
  "Nome/Vulgo",
  "E-mail",
  "Aceitou os termos",
  "Ligação com órgão governamental",
  "Atualizado em",
  "WhatsApp",
];
const COL_UPDATED = 6;
const COL_WHATSAPP = 7;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // evita duas confirmações gravando na mesma linha ao mesmo tempo

  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (data.secret !== SECRET) return json({ ok: false, error: "não autorizado" });

    const name = String(data.name || "").trim().slice(0, 80);
    const email = String(data.email || "").trim().toLowerCase().slice(0, 160);
    const whatsapp = String(data.whatsapp || "").trim().slice(0, 30);
    if (!name || !email || !whatsapp || data.acceptedTerms !== true) {
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
      sheet.getRange(existing, COL_UPDATED).setValue(now);
      sheet.getRange(existing, COL_WHATSAPP).setValue(whatsapp);
    } else {
      sheet.appendRow([now].concat(row).concat(["", whatsapp]));
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
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  // Planilha criada antes do campo de WhatsApp: adiciona o cabeçalho que falta
  if (sheet.getRange(1, COL_WHATSAPP).getValue() === "") {
    sheet.getRange(1, COL_WHATSAPP).setValue("WhatsApp").setFontWeight("bold");
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
