import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";
import { parse } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(sql);

async function importPensionerData() {
  try {
    // First create the table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS pensioners (
        id SERIAL PRIMARY KEY,
        code TEXT NOT NULL,
        bank_accountnumber TEXT,
        annualbasicsalary NUMERIC,
        bank_name TEXT,
        bank_branchcode TEXT,
        company TEXT,
        costcentre TEXT,
        currency TEXT,
        dailyrate NUMERIC,
        dateofbirth DATE,
        dateofengagement DATE,
        dateoftermination DATE,
        department_code TEXT,
        department TEXT,
        employee TEXT,
        firstname TEXT,
        gender TEXT,
        grosspay NUMERIC,
        hourlyrate NUMERIC,
        hoursperperiod NUMERIC,
        maritalstatus TEXT,
        nationalidentificationno TEXT,
        nationality TEXT,
        occupation TEXT,
        paymentbasis TEXT,
        paymentmethod TEXT,
        paymentpointcode TEXT,
        paymentpoint TEXT,
        payroll TEXT,
        personalemailaddress TEXT,
        phoneno TEXT,
        phoneno2 TEXT,
        physicaladdress TEXT,
        physicaladdress2 TEXT,
        position TEXT,
        postaladdress TEXT,
        postaladdress2 TEXT,
        retirementdate DATE,
        surname TEXT,
        taxationmethod TEXT,
        taxableearnings NUMERIC,
        totaldeductions NUMERIC,
        pension NUMERIC,
        pensionlumpsum NUMERIC,
        pensionarrearsupload NUMERIC,
        pensionlumpsumarrearsupload NUMERIC,
        usdallowance NUMERIC,
        payecalculated NUMERIC,
        taxlevy NUMERIC,
        netpaid NUMERIC
      )
    `;

    // Read the CSV file
    const csvContent = await fs.readFile(
      "client/src/lib/pensioner_csv/Pensionersdetails.csv",
      "utf-8",
    );
    console.log("CSV file read successfully");

    // Parse CSV content with better options for handling empty values
    const records = parse(csvContent, {
      columns: (header) =>
        header.map((col) => {
          // Remove BOM and clean up column names
          col = col.replace(/^\uFEFF/, "");
          // Convert to lowercase and remove spaces
          return col.toLowerCase().replace(/[_ ]/g, "").trim();
        }),
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      cast: (value, context) => {
        if (value === "") return null;
        // Handle dates
        if (
          [
            "dateofbirth",
            "dateofengagement",
            "dateoftermination",
            "retirementdate",
          ].includes(context.column)
        ) {
          if (!value) return null;
          // Parse date and format as YYYY-MM-DD
          const date = new Date(value);
          if (isNaN(date.getTime())) return null;
          return date.toISOString().split("T")[0];
        }
        // Handle numeric values
        if (
          [
            "annualbasicsalary",
            "dailyrate",
            "grosspay",
            "hourlyrate",
            "hoursperperiod",
            "taxableearnings",
            "totaldeductions",
            "pension",
            "pensionlumpsum",
            "pensionarrearsupload",
            "pensionlumpsumarrearsupload",
            "usdallowance",
            "payecalculated",
            "taxlevy",
            "netpaid",
          ].includes(context.column)
        ) {
          return value ? parseFloat(value) : null;
        }
        return value;
      },
    });
    console.log(`Found ${records.length} records to import`);

    // Insert records one by one
    for (const [index, record] of records.entries()) {
      try {
        // Convert empty strings to null for all fields
        const sanitizedRecord = Object.fromEntries(
          Object.entries(record).map(([key, value]) => [
            key,
            value === "" ? null : value,
          ]),
        );

        await sql`
          INSERT INTO pensioners (
            code, bank_accountnumber, annualbasicsalary, bank_name, bank_branchcode,
            company, costcentre, currency, dailyrate, dateofbirth, dateofengagement,
            dateoftermination, department_code, department, employee, firstname,
            gender, grosspay, hourlyrate, hoursperperiod, maritalstatus,
            nationalidentificationno, nationality, occupation, paymentbasis,
            paymentmethod, paymentpointcode, paymentpoint, payroll,
            personalemailaddress, phoneno, phoneno2, physicaladdress,
            physicaladdress2, position, postaladdress, postaladdress2,
            retirementdate, surname, taxationmethod, taxableearnings,
            totaldeductions, pension, pensionlumpsum, pensionarrearsupload,
            pensionlumpsumarrearsupload, usdallowance, payecalculated,
            taxlevy, netpaid
          ) VALUES (
            ${sanitizedRecord.code}, ${sanitizedRecord.bankaccountnumber}, ${sanitizedRecord.annualbasicsalary},
            ${sanitizedRecord.bankname}, ${sanitizedRecord.bankbranchcode}, ${sanitizedRecord.company},
            ${sanitizedRecord.costcentre}, ${sanitizedRecord.currency}, ${sanitizedRecord.dailyrate},
            ${sanitizedRecord.dateofbirth}, ${sanitizedRecord.dateofengagement}, ${sanitizedRecord.dateoftermination},
            ${sanitizedRecord.departmentcode}, ${sanitizedRecord.department}, ${sanitizedRecord.employee},
            ${sanitizedRecord.firstname}, ${sanitizedRecord.gender}, ${sanitizedRecord.grosspay},
            ${sanitizedRecord.hourlyrate}, ${sanitizedRecord.hoursperperiod}, ${sanitizedRecord.maritalstatus},
            ${sanitizedRecord.nationalidentificationno}, ${sanitizedRecord.nationality},
            ${sanitizedRecord.occupation}, ${sanitizedRecord.paymentbasis}, ${sanitizedRecord.paymentmethod},
            ${sanitizedRecord.paymentpointcode}, ${sanitizedRecord.paymentpoint}, ${sanitizedRecord.payroll},
            ${sanitizedRecord.personalemailaddress}, ${sanitizedRecord.phoneno}, ${sanitizedRecord.phoneno2},
            ${sanitizedRecord.physicaladdress}, ${sanitizedRecord.physicaladdress2}, ${sanitizedRecord.position},
            ${sanitizedRecord.postaladdress}, ${sanitizedRecord.postaladdress2}, ${sanitizedRecord.retirementdate},
            ${sanitizedRecord.surname}, ${sanitizedRecord.taxationmethod}, ${sanitizedRecord.taxableearnings},
            ${sanitizedRecord.totaldeductions}, ${sanitizedRecord.pension}, ${sanitizedRecord.pensionlumpsum},
            ${sanitizedRecord.pensionarrearsupload}, ${sanitizedRecord.pensionlumpsumarrearsupload},
            ${sanitizedRecord.usdallowance}, ${sanitizedRecord.payecalculated}, ${sanitizedRecord.taxlevy},
            ${sanitizedRecord.netpaid}
          )
        `;

        if ((index + 1) % 100 === 0) {
          console.log(`Imported ${index + 1} records...`);
        }
      } catch (error) {
        console.error(`Failed to import record at index ${index}:`, error);
        console.error("Problem record:", record);
        throw error;
      }
    }

    console.log("Successfully imported pensioner data");
  } catch (error) {
    console.error("Failed to import pensioner data:", error);
    throw error;
  }
}

async function main() {
  console.log("Starting pensioner data import process...");

  try {
    // Try to run Drizzle migration but don't fail if it errors
    try {
      await migrate(db, {
        migrationsFolder: join(__dirname, "migrations"),
      });
      console.log("Schema migration completed successfully");
    } catch (error) {
      console.log("Schema migration skipped:", error.message);
    }

    // Import the pensioner data
    await importPensionerData();
    console.log("Pensioner data import completed successfully");
  } catch (error) {
    console.error("Process failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
