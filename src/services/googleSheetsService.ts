import { google } from "googleapis";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

async function authorize() {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || "{}");
    const { client_email, private_key } = credentials;
    const auth = new JWT(client_email, undefined, private_key, SCOPES);
    return auth;
}

async function getSheetData(auth: JWT, spreadsheetId: string, range: string) {
    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return response.data.values;
}

export async function fetchGoogleSheetData(spreadsheetId: string, range: string) {
    const auth = await authorize();
    return await getSheetData(auth, spreadsheetId, range);
}