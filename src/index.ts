import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import path from "node:path";
import {fetchGoogleSheetData} from "./services/googleSheetsService";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")))

app.get("/", async (_req: Request, res: Response) => {
    try {
        const spreadsheetId = process.env.SPREADSHEET_ID || "default_spreadsheet_id";
        const range = process.env.SPREADSHEET_RANGE || "default_range";
        const data = await fetchGoogleSheetData(spreadsheetId, range);
        res.render("sheet", {
            title: "DnD Quotes",
            message: "DnD Quotes",
            spreadsheet_data: data,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.render("error", {
                title: "Error",
                message: error.message,
            });
        } else {
            return res.render("error", {
                title: "Error",
                message: "An unknown error occurred",
            });
        }
    }
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});