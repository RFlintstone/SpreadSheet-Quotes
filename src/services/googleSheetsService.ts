import { google } from "googleapis";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

// Base64 validation function
function isBase64(str: string): boolean {
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(str);
}

async function authorize() {
    const base64Credentials = process.env.GOOGLE_SERVICE_ACCOUNT;
    let client_email: string;
    let private_key: string;

    if (!base64Credentials) {
        throw new Error("GOOGLE_SERVICE_ACCOUNT environment variable is missing.");
    }

    if (isBase64(base64Credentials)) {
        try {
            // Try decoding the Base64 credentials
            const credentials = JSON.parse(Buffer.from(base64Credentials, "base64").toString("ascii"));
            ({ client_email, private_key } = credentials);
        } catch (e) {
            throw new Error("Failed to decode Base64 credentials. Invalid format.");
        }
    } else {
        // Fall back to using the non-decoded string directly
        try {
            const credentials = JSON.parse(base64Credentials); // Use the plain string directly
            ({ client_email, private_key } = credentials);
        } catch (e) {
            throw new Error("Failed to parse credentials. Neither Base64 encoded nor valid JSON.");
        }
    }

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