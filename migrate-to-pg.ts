import 'dotenv/config';
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";
import { parse } from "csv-parse/sync";
import * as schema from "./shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Use postgres-js directly instead of Neon serverless
const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(sql, { schema });

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

        // Use parameterized query to avoid SQL injection
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
            ${sanitizedRecord.code || null}, ${sanitizedRecord.bankaccountnumber || null}, 
            ${sanitizedRecord.annualbasicsalary || null}, ${sanitizedRecord.bankname || null}, 
            ${sanitizedRecord.bankbranchcode || null}, ${sanitizedRecord.company || null},
            ${sanitizedRecord.costcentre || null}, ${sanitizedRecord.currency || null}, 
            ${sanitizedRecord.dailyrate || null}, ${sanitizedRecord.dateofbirth || null}, 
            ${sanitizedRecord.dateofengagement || null}, ${sanitizedRecord.dateoftermination || null},
            ${sanitizedRecord.departmentcode || null}, ${sanitizedRecord.department || null}, 
            ${sanitizedRecord.employee || null}, ${sanitizedRecord.firstname || null}, 
            ${sanitizedRecord.gender || null}, ${sanitizedRecord.grosspay || null},
            ${sanitizedRecord.hourlyrate || null}, ${sanitizedRecord.hoursperperiod || null}, 
            ${sanitizedRecord.maritalstatus || null}, ${sanitizedRecord.nationalidentificationno || null}, 
            ${sanitizedRecord.nationality || null}, ${sanitizedRecord.occupation || null}, 
            ${sanitizedRecord.paymentbasis || null}, ${sanitizedRecord.paymentmethod || null},
            ${sanitizedRecord.paymentpointcode || null}, ${sanitizedRecord.paymentpoint || null}, 
            ${sanitizedRecord.payroll || null}, ${sanitizedRecord.personalemailaddress || null}, 
            ${sanitizedRecord.phoneno || null}, ${sanitizedRecord.phoneno2 || null},
            ${sanitizedRecord.physicaladdress || null}, ${sanitizedRecord.physicaladdress2 || null}, 
            ${sanitizedRecord.position || null}, ${sanitizedRecord.postaladdress || null}, 
            ${sanitizedRecord.postaladdress2 || null}, ${sanitizedRecord.retirementdate || null},
            ${sanitizedRecord.surname || null}, ${sanitizedRecord.taxationmethod || null}, 
            ${sanitizedRecord.taxableearnings || null}, ${sanitizedRecord.totaldeductions || null}, 
            ${sanitizedRecord.pension || null}, ${sanitizedRecord.pensionlumpsum || null},
            ${sanitizedRecord.pensionarrearsupload || null}, ${sanitizedRecord.pensionlumpsumarrearsupload || null},
            ${sanitizedRecord.usdallowance || null}, ${sanitizedRecord.payecalculated || null}, 
            ${sanitizedRecord.taxlevy || null}, ${sanitizedRecord.netpaid || null}
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

// Create all the tables explicitly using the Drizzle schema
async function createAllTables() {
  console.log("Creating all database tables from schema...");
  
  try {
    // Generate SQL for users table
    console.log("Creating users table...");
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        full_name TEXT,
        role TEXT NOT NULL DEFAULT 'user'
      )
    `;
    
    // Create pensioner_regulations table
    console.log("Creating pensioner_regulations table...");
    await sql`
      CREATE TABLE IF NOT EXISTS pensioner_regulations (
        id SERIAL PRIMARY KEY, 
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        pensioner_name TEXT NOT NULL,
        contact_info TEXT NOT NULL, 
        pensioner_code TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        email TEXT,
        supervisor_email TEXT,
        pensioner_id INTEGER,
        submitted_by INTEGER,
        documents JSONB,
        approved_by INTEGER
      )
    `;
    
    // Create queries table
    console.log("Creating queries table...");
    await sql`
      CREATE TABLE IF NOT EXISTS queries (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        pensioner_name TEXT NOT NULL,
        contact_info TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        email TEXT,
        documents JSONB,
        supervisor_email TEXT,
        pensioner_id INTEGER,
        assigned_to INTEGER,
        submitted_by INTEGER
      )
    `;
    
    // Create claims table
    console.log("Creating claims table...");
    await sql`
      CREATE TABLE IF NOT EXISTS claims (
        id SERIAL PRIMARY KEY,
        claim_number TEXT UNIQUE,
        category TEXT NOT NULL,
        pensioner_name TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        supervisor_email TEXT,
        pensioner_id INTEGER,
        documents JSONB,
        submitted_by INTEGER,
        approved_by INTEGER
      )
    `;
    
    // Create email_logs table
    console.log("Creating email_logs table...");
    await sql`
      CREATE TABLE IF NOT EXISTS email_logs (
        id SERIAL PRIMARY KEY,
        recipient TEXT NOT NULL,
        subject TEXT NOT NULL,
        status TEXT NOT NULL,
        error TEXT,
        retry_count INTEGER NOT NULL DEFAULT 0,
        sent_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        query_id INTEGER,
        claim_id INTEGER
      )
    `;
    
    // Create query_status_history table
    console.log("Creating query_status_history table...");
    await sql`
      CREATE TABLE IF NOT EXISTS query_status_history (
        id SERIAL PRIMARY KEY,
        query_id INTEGER NOT NULL,
        old_status TEXT NOT NULL,
        new_status TEXT NOT NULL,
        changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        changed_by INTEGER NOT NULL,
        notes TEXT
      )
    `;
    
    // Create claim_status_history table
    console.log("Creating claim_status_history table...");
    await sql`
      CREATE TABLE IF NOT EXISTS claim_status_history (
        id SERIAL PRIMARY KEY,
        claim_id INTEGER NOT NULL,
        old_status TEXT NOT NULL,
        new_status TEXT NOT NULL,
        changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        changed_by INTEGER NOT NULL,
        notes TEXT
      )
    `;
    
    // Create regulation_status_history table
    console.log("Creating regulation_status_history table...");
    await sql`
      CREATE TABLE IF NOT EXISTS regulation_status_history (
        id SERIAL PRIMARY KEY,
        regulation_id INTEGER NOT NULL,
        old_status TEXT NOT NULL,
        new_status TEXT NOT NULL,
        changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        changed_by INTEGER NOT NULL,
        notes TEXT
      )
    `;
    
    console.log("All tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}

async function main() {
  console.log("Starting database migration and pensioner data import process to PostgreSQL...");

  try {
    // Try to run Drizzle migration but don't fail if it errors
    try {
      await migrate(db, {
        migrationsFolder: join(__dirname, "migrations"),
      });
      console.log("Schema migration completed successfully");
    } catch (error) {
      console.log("Schema migration skipped:", error.message);
      
      // If migration fails, try creating the tables explicitly
      await createAllTables();
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