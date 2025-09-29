
import fs from "fs";
import XLSX from "xlsx";
const fsp = fs.promises;

export async function extractFromJsonPath(filePath) {
    const fileContent = await fsp.readFile(filePath, 'utf8');
    let parsed = JSON.parse(fileContent);
    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        parsed = [parsed];
    }
    if (!Array.isArray(parsed)) {
        throw new Error('JSON file must contain an array or object at the top level.');
    }
    if (!parsed.every(item => typeof item === 'object' && item !== null)) {
        throw new Error('JSON array must contain objects.');
    }
    return parsed;
}

export function extractFromXlsxPath(filePath) {
    const workbook = XLSX.readFile(filePath);
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('No sheets found in XLSX file.');
    }
    // Extract all sheets as arrays, but default to first sheet if only one is needed
    const result = {};
    let foundData = false;
    for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        if (Array.isArray(data) && data.length > 0) {
            result[sheetName] = data;
            foundData = true;
        }
    }
    if (!foundData) {
        throw new Error('No data found in any sheet of the XLSX file.');
    }
    // If only one sheet, return its array directly for convenience
    if (Object.keys(result).length === 1) {
        return result[workbook.SheetNames[0]];
    }
    return result;
}