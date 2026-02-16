var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  claimStatusHistory: () => claimStatusHistory,
  claimStatusHistoryRelations: () => claimStatusHistoryRelations,
  claims: () => claims,
  claimsRelations: () => claimsRelations,
  emailLogs: () => emailLogs,
  emailLogsRelations: () => emailLogsRelations,
  insertClaimSchema: () => insertClaimSchema,
  insertClaimStatusHistorySchema: () => insertClaimStatusHistorySchema,
  insertEmailLogSchema: () => insertEmailLogSchema,
  insertPensionerRegulationSchema: () => insertPensionerRegulationSchema,
  insertQuerySchema: () => insertQuerySchema,
  insertQueryStatusHistorySchema: () => insertQueryStatusHistorySchema,
  insertRegulationStatusHistorySchema: () => insertRegulationStatusHistorySchema,
  insertUserSchema: () => insertUserSchema,
  pensionerRegulations: () => pensionerRegulations,
  pensioners: () => pensioners,
  pensionersRelations: () => pensionersRelations,
  queries: () => queries,
  queriesRelations: () => queriesRelations,
  queryStatusHistory: () => queryStatusHistory,
  queryStatusHistoryRelations: () => queryStatusHistoryRelations,
  regulationRelations: () => regulationRelations,
  regulationStatusHistory: () => regulationStatusHistory,
  regulationStatusHistoryRelations: () => regulationStatusHistoryRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  json,
  numeric,
  date
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var users, emailLogs, queries, claims, pensioners, queryStatusHistory, claimStatusHistory, regulationStatusHistory, pensionerRegulations, usersRelations, queriesRelations, claimsRelations, pensionersRelations, queryStatusHistoryRelations, claimStatusHistoryRelations, regulationStatusHistoryRelations, regulationRelations, emailLogsRelations, insertUserSchema, insertQuerySchema, insertClaimSchema, insertQueryStatusHistorySchema, insertClaimStatusHistorySchema, insertEmailLogSchema, insertPensionerRegulationSchema, insertRegulationStatusHistorySchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      zesa_no: text("zesa_no").unique().notNull(),
      username: text("username").notNull(),
      email: text("email").notNull().unique(),
      password: text("password").notNull(),
      role: text("role", { enum: ["admin", "superadmin", "supervisor"] }).notNull()
    });
    emailLogs = pgTable("email_logs", {
      id: serial("id").primaryKey(),
      recipient: text("recipient").notNull(),
      subject: text("subject").notNull(),
      status: text("status", { enum: ["pending", "sent", "failed"] }).notNull(),
      error: text("error"),
      retryCount: integer("retry_count").notNull().default(0),
      sentAt: timestamp("sent_at"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow(),
      queryId: integer("query_id").references(() => queries.id),
      claimId: integer("claim_id").references(() => claims.id)
    });
    queries = pgTable("queries", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      status: text("status", {
        enum: ["open", "in_progress", "resolved"]
      }).notNull(),
      category: text("category", {
        enum: [
          "Pension benefits",
          "Mortgage",
          "Letter",
          "Banking details",
          "Stop Order",
          "Missing Documents",
          "Benefit Letter",
          "Other",
          "Banc ABC",
          "Benefits Enquiry",
          "Change of details",
          "Communication",
          "Confirmation letters",
          "Electricity letter",
          "Employer Funded Benefits",
          "Life certificate",
          "Medical Shortfalls",
          "Non Payment of Pension Benefits",
          "Payslip request",
          "Sporting"
        ]
      }).notNull().default("Other"),
      departments: text("departments", {
        enum: ["Finance", "Benefits", "Property Development"]
      }).notNull().default("Finance"),
      Channel: text("channels", {
        enum: ["WhatsApp", "Email", "Phone Call", "Walk In", "Mail"]
      }).notNull().default("Email"),
      submittedAt: timestamp("submitted_at").notNull().defaultNow(),
      pensionerName: text("pensioner_name").notNull(),
      contactInfo: text("contact_info").notNull(),
      email: text("email"),
      supervisorEmail: text("supervisorEmail"),
      assignedTo: integer("assigned_to").references(() => users.id),
      pensionerId: integer("pensioner_id").references(() => pensioners.id),
      documents: json("documents").notNull().default([]),
      submittedBy: integer("submitted_by").references(() => users.id)
    });
    claims = pgTable("claims", {
      id: serial("id").primaryKey(),
      claimNumber: text("claim_number").notNull().unique(),
      pensionerName: text("pensioner_name").notNull(),
      amount: integer("amount"),
      status: text("status", {
        enum: ["pending", "approved", "rejected", "paid"]
      }).notNull(),
      Channel: text("channels", {
        enum: ["WhatsApp", "Email", "Phone Call", "Walk In", "Mail"]
      }).notNull().default("Email"),
      category: text("category", {
        enum: ["Retirement", "Death Claim", "Withdrawal"]
      }).notNull().default("Retirement"),
      submittedAt: timestamp("submitted_at").notNull().defaultNow(),
      documents: json("documents").notNull(),
      approvedBy: integer("approved_by").references(() => users.id),
      pensionerId: integer("pensioner_id").references(() => pensioners.id),
      supervisorEmail: text("supervisor_email"),
      submittedBy: integer("submitted_by").references(() => users.id)
    });
    pensioners = pgTable("pensioners", {
      id: serial("id").primaryKey(),
      code: text("code").notNull(),
      bankAccountnumber: text("bank_accountnumber"),
      annualbasicsalary: numeric("annualbasicsalary"),
      bankName: text("bank_name"),
      bankBranchcode: text("bank_branchcode"),
      company: text("company"),
      costcentre: text("costcentre"),
      currency: text("currency"),
      dailyrate: numeric("dailyrate"),
      dateofbirth: date("dateofbirth"),
      dateofengagement: date("dateofengagement"),
      dateoftermination: date("dateoftermination"),
      departmentCode: text("department_code"),
      department: text("department"),
      employee: text("employee"),
      firstname: text("firstname"),
      gender: text("gender"),
      grosspay: numeric("grosspay"),
      hourlyrate: numeric("hourlyrate"),
      hoursperperiod: numeric("hoursperperiod"),
      maritalstatus: text("maritalstatus"),
      nationalidentificationno: text("nationalidentificationno"),
      nationality: text("nationality"),
      occupation: text("occupation"),
      paymentbasis: text("paymentbasis"),
      paymentmethod: text("paymentmethod"),
      paymentpointcode: text("paymentpointcode"),
      paymentpoint: text("paymentpoint"),
      payroll: text("payroll"),
      phoneno: text("phoneno"),
      phoneno2: text("phoneno2"),
      physicaladdress: text("physicaladdress"),
      physicaladdress2: text("physicaladdress2"),
      position: text("position"),
      postaladdress: text("postaladdress"),
      postaladdress2: text("postaladdress2"),
      retirementdate: date("retirementdate"),
      surname: text("surname"),
      taxationmethod: text("taxationmethod"),
      taxableearnings: numeric("taxableearnings"),
      totaldeductions: numeric("totaldeductions"),
      pension: numeric("pension"),
      pensionlumpsum: numeric("pensionlumpsum"),
      pensionarrearsupload: numeric("pensionarrearsupload"),
      pensionlumpsumarrearsupload: numeric("pensionlumpsumarrearsupload"),
      personalemailaddress: text("personalemailaddress"),
      usdallowance: numeric("usdallowance"),
      payecalculated: numeric("payecalculated"),
      taxlevy: numeric("taxlevy"),
      netpaid: numeric("netpaid"),
      hasStopOrder: boolean("has_stop_order").default(false),
      email: text("email")
    });
    queryStatusHistory = pgTable("query_status_history", {
      id: serial("id").primaryKey(),
      queryId: integer("query_id").notNull().references(() => queries.id),
      oldStatus: text("old_status", {
        enum: ["open", "in_progress", "resolved"]
      }).notNull(),
      newStatus: text("new_status", {
        enum: ["open", "in_progress", "resolved"]
      }).notNull(),
      changedBy: integer("changed_by").references(() => users.id),
      changedAt: timestamp("changed_at").notNull().defaultNow(),
      notes: text("notes")
    });
    claimStatusHistory = pgTable("claim_status_history", {
      id: serial("id").primaryKey(),
      claimId: integer("claim_id").notNull().references(() => claims.id),
      oldStatus: text("old_status", {
        enum: ["pending", "approved", "rejected", "paid"]
      }).notNull(),
      newStatus: text("new_status", {
        enum: ["pending", "approved", "rejected", "paid"]
      }).notNull(),
      changedBy: integer("changed_by").references(() => users.id),
      changedAt: timestamp("changed_at").notNull().defaultNow(),
      notes: text("notes")
    });
    regulationStatusHistory = pgTable("regulation_status_history", {
      id: serial("id").primaryKey(),
      regulationId: integer("regulationid").notNull().references(() => pensionerRegulations.id),
      oldStatus: text("oldstatus", {
        // Column name in database is 'oldstatus' without underscore
        enum: ["pending", "approved", "rejected"]
      }).notNull(),
      newStatus: text("newstatus", {
        // Column name in database is 'newstatus' without underscore
        enum: ["pending", "approved", "rejected"]
      }).notNull(),
      changedBy: integer("changedby").references(() => users.id),
      // Column name in database is 'changedby' without underscore
      changedAt: timestamp("changedat").notNull().defaultNow(),
      // Column name in database is 'changedat' without underscore
      notes: text("notes")
    });
    pensionerRegulations = pgTable("pensioner_regulations", {
      id: serial("id").primaryKey(),
      pensionerCode: text("pensioner_code").notNull(),
      pensionerName: text("pensioner_name").notNull(),
      contactInfo: text("contact_info").notNull(),
      email: text("email"),
      category: text("category", {
        enum: ["Masterfile Changes", "Payslip Input Changes", "Stop Order"]
      }).notNull(),
      description: text("description").notNull(),
      status: text("status", {
        enum: ["pending", "approved", "rejected"]
      }).notNull().default("pending"),
      documents: json("documents").notNull().default([]),
      supervisorEmail: text("supervisor_email"),
      submittedAt: timestamp("submitted_at").notNull().defaultNow(),
      submittedBy: integer("submitted_by").references(() => users.id),
      pensionerId: integer("pensioner_id").references(() => pensioners.id)
    });
    usersRelations = relations(users, ({ many }) => ({
      queries: many(queries),
      claims: many(claims),
      regulations: many(pensionerRegulations)
    }));
    queriesRelations = relations(queries, ({ one }) => ({
      assignedUser: one(users, {
        fields: [queries.assignedTo],
        references: [users.id]
      }),
      pensioner: one(pensioners, {
        fields: [queries.pensionerId],
        references: [pensioners.id]
      })
    }));
    claimsRelations = relations(claims, ({ one }) => ({
      approvedByUser: one(users, {
        fields: [claims.approvedBy],
        references: [users.id]
      }),
      pensioner: one(pensioners, {
        fields: [claims.pensionerId],
        references: [pensioners.id]
      })
    }));
    pensionersRelations = relations(pensioners, ({ many }) => ({
      queries: many(queries),
      claims: many(claims),
      regulations: many(pensionerRegulations)
    }));
    queryStatusHistoryRelations = relations(
      queryStatusHistory,
      ({ one }) => ({
        query: one(queries, {
          fields: [queryStatusHistory.queryId],
          references: [queries.id]
        }),
        user: one(users, {
          fields: [queryStatusHistory.changedBy],
          references: [users.id]
        })
      })
    );
    claimStatusHistoryRelations = relations(
      claimStatusHistory,
      ({ one }) => ({
        claim: one(claims, {
          fields: [claimStatusHistory.claimId],
          references: [claims.id]
        }),
        user: one(users, {
          fields: [claimStatusHistory.changedBy],
          references: [users.id]
        })
      })
    );
    regulationStatusHistoryRelations = relations(
      regulationStatusHistory,
      ({ one }) => ({
        regulation: one(pensionerRegulations, {
          fields: [regulationStatusHistory.regulationId],
          references: [pensionerRegulations.id]
        }),
        user: one(users, {
          fields: [regulationStatusHistory.changedBy],
          references: [users.id]
        })
      })
    );
    regulationRelations = relations(
      pensionerRegulations,
      ({ one }) => ({
        pensioner: one(pensioners, {
          fields: [pensionerRegulations.pensionerId],
          references: [pensioners.id]
        }),
        submitter: one(users, {
          fields: [pensionerRegulations.submittedBy],
          references: [users.id]
        })
      })
    );
    emailLogsRelations = relations(emailLogs, ({ one }) => ({
      query: one(queries, {
        fields: [emailLogs.queryId],
        references: [queries.id]
      }),
      claim: one(claims, {
        fields: [emailLogs.claimId],
        references: [claims.id]
      })
    }));
    insertUserSchema = createInsertSchema(users).pick({
      zesa_no: true,
      username: true,
      email: true,
      password: true,
      role: true
    });
    insertQuerySchema = createInsertSchema(queries).pick({
      title: true,
      description: true,
      pensionerName: true,
      contactInfo: true,
      email: true,
      pensionerId: true,
      documents: true,
      category: true,
      supervisorEmail: true,
      submittedBy: true
    });
    insertClaimSchema = createInsertSchema(claims).pick({
      pensionerName: true,
      amount: true,
      documents: true,
      pensionerId: true,
      category: true,
      supervisorEmail: true,
      submittedBy: true
    });
    insertQueryStatusHistorySchema = createInsertSchema(
      queryStatusHistory
    ).pick({
      queryId: true,
      oldStatus: true,
      newStatus: true,
      changedBy: true,
      notes: true
    });
    insertClaimStatusHistorySchema = createInsertSchema(
      claimStatusHistory
    ).pick({
      claimId: true,
      oldStatus: true,
      newStatus: true,
      changedBy: true,
      notes: true
    });
    insertEmailLogSchema = createInsertSchema(emailLogs).pick({
      recipient: true,
      subject: true,
      status: true,
      error: true,
      retryCount: true,
      queryId: true,
      claimId: true
    });
    insertPensionerRegulationSchema = createInsertSchema(
      pensionerRegulations
    ).pick({
      pensionerCode: true,
      pensionerName: true,
      contactInfo: true,
      email: true,
      category: true,
      description: true,
      documents: true,
      supervisorEmail: true,
      pensionerId: true,
      submittedBy: true
    });
    insertRegulationStatusHistorySchema = createInsertSchema(
      regulationStatusHistory
    ).pick({
      regulationId: true,
      oldStatus: true,
      newStatus: true,
      changedBy: true,
      notes: true
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  closeConnections: () => closeConnections,
  db: () => db,
  initializeDatabase: () => initializeDatabase
});
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL must be set for local PostgreSQL connection. Example: postgres://username:password@localhost:5432/dbname"
    );
  }
  return url;
}
async function initializeDatabase() {
  if (dbClient) return;
  try {
    console.log("Connecting to PostgreSQL database...");
    const databaseUrl = getDatabaseUrl();
    dbClient = postgres(databaseUrl, {
      max: 10,
      idle_timeout: 20,
      onnotice: () => {
      }
    });
    await dbClient`SELECT 1`;
    dbInstance = drizzle(dbClient, { schema: schema_exports });
    console.log("Successfully connected to PostgreSQL database");
  } catch (error) {
    console.error("Failed to connect to PostgreSQL database:", error);
    throw new Error("Database connection failed");
  }
}
async function closeConnections() {
  if (dbClient) {
    try {
      await dbClient.end();
      console.log("Closed PostgreSQL database connection");
    } catch (error) {
      console.error("Error closing database connection:", error);
    }
    dbClient = null;
    dbInstance = null;
  }
}
var dbClient, dbInstance, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    dbClient = null;
    dbInstance = null;
    db = new Proxy(
      {},
      {
        get(_target, prop) {
          if (!dbInstance) {
            throw new Error(
              "Database not initialized. Call initializeDatabase() first."
            );
          }
          return dbInstance[prop];
        }
      }
    );
  }
});

// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/storage.ts
init_schema();
init_db();
import { eq as eq2, or, desc, sql } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
import { nanoid } from "nanoid";

// server/services/email.ts
init_db();
init_schema();
import "dotenv/config";
import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
var logoImage = "client/src/lib/logos/zeipf_logo.png";
var port_alternatives = [2525, 8025, 587];
var MAX_RETRIES = 3;
var RETRY_DELAY = 1e3;
async function logEmailAttempt(log2) {
  try {
    const [emailLog] = await db.insert(emailLogs).values(log2).returning();
    console.log("Email log created:", emailLog);
    return emailLog;
  } catch (error) {
    console.error("Failed to create email log:", error);
    return null;
  }
}
async function updateEmailLog(id, updates) {
  try {
    const [updated] = await db.update(emailLogs).set(updates).where(eq(emailLogs.id, id)).returning();
    console.log("Email log updated:", updated);
    return updated;
  } catch (error) {
    console.error("Failed to update email log:", error);
  }
}
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sendQueryEmail(params, queryId) {
  return sendEmail(params, queryId, void 0);
}
async function sendEmail(params, queryId, claimId) {
  let emailLogId;
  console.log("Email service: Starting to send email to:", params.to);
  console.log("Email service: Subject:", params.subject);
  if (!process.env.SMTP2GO_USERNAME || !process.env.SMTP2GO_PASSWORD) {
    console.error("Email service: Missing SMTP credentials!");
    console.log(
      "Email service: SMTP2GO_USERNAME exists:",
      !!process.env.SMTP2GO_USERNAME
    );
    console.log(
      "Email service: SMTP2GO_PASSWORD exists:",
      !!process.env.SMTP2GO_PASSWORD
    );
    await logEmailAttempt({
      recipient: params.to,
      subject: params.subject,
      status: "failed",
      error: "Missing SMTP credentials",
      retryCount: 0
    });
    return false;
  }
  const initialLog = await logEmailAttempt({
    recipient: params.to,
    subject: params.subject,
    status: "pending",
    retryCount: 0,
    queryId,
    claimId
  });
  if (initialLog) {
    emailLogId = initialLog.id;
    console.log("Email service: Created log entry with ID:", emailLogId);
  }
  for (let retryCount = 0; retryCount <= MAX_RETRIES; retryCount++) {
    if (retryCount > 0) {
      console.log(
        `Email service: Retry attempt ${retryCount} with delay ${RETRY_DELAY * Math.pow(2, retryCount - 1)}ms`
      );
      await sleep(RETRY_DELAY * Math.pow(2, retryCount - 1));
      if (emailLogId) {
        await updateEmailLog(emailLogId, { retryCount });
      }
    }
    for (const port of port_alternatives) {
      try {
        console.log(
          `Email service: Attempting to send email via port ${port}, attempt ${retryCount + 1}/${MAX_RETRIES + 1}`
        );
        const transportOptions = {
          host: "mail.smtp2go.com",
          port,
          secure: false,
          auth: {
            user: process.env.SMTP2GO_USERNAME,
            pass: process.env.SMTP2GO_PASSWORD
          },
          // Adding recommended production settings
          connectionTimeout: 1e4,
          // 10 seconds
          greetingTimeout: 1e4,
          socketTimeout: 1e4,
          debug: process.env.NODE_ENV !== "production",
          logger: process.env.NODE_ENV !== "production"
        };
        console.log("Email service: Transport configuration:", {
          host: transportOptions.host,
          port: transportOptions.port,
          secure: transportOptions.secure,
          username: transportOptions.auth.user ? "(provided)" : "(missing)",
          password: transportOptions.auth.pass ? "(provided)" : "(missing)"
        });
        const transporter = nodemailer.createTransport(transportOptions);
        console.log("Email service: Verifying connection...");
        await transporter.verify();
        console.log("Email service: Connection verified successfully!");
        const mailOptions = {
          from: {
            name: "ZESA Pension Fund",
            address: process.env.SMTP2GO_FROM_EMAIL || "no-reply@zesapf.com"
          },
          to: params.to,
          subject: params.subject,
          html: params.html || params.text || "",
          attachments: [
            {
              filename: "logo.png",
              path: logoImage,
              cid: "preloader"
            }
          ]
        };
        console.log("Email service: Sending mail with options:", {
          to: mailOptions.to,
          subject: mailOptions.subject,
          from: mailOptions.from,
          attachments: mailOptions.attachments ? mailOptions.attachments.length : 0
        });
        const info = await transporter.sendMail(mailOptions);
        console.log("Email service: Email sent successfully:", {
          messageId: info.messageId,
          recipient: params.to,
          subject: params.subject,
          response: info.response
        });
        if (emailLogId) {
          await updateEmailLog(emailLogId, {
            status: "sent",
            sentAt: /* @__PURE__ */ new Date()
          });
        }
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Email service: SMTP2GO email error on port ${port}:`, {
          error: errorMessage,
          port,
          attempt: retryCount + 1,
          recipient: params.to,
          subject: params.subject
        });
        if (error instanceof Error) {
          console.error("Email service: Stack trace:", error.stack);
        }
        if (retryCount === MAX_RETRIES && port === port_alternatives[port_alternatives.length - 1] && emailLogId) {
          console.log(
            "Email service: All retry attempts exhausted. Marking as failed."
          );
          await updateEmailLog(emailLogId, {
            status: "failed",
            error: errorMessage
          });
        }
      }
    }
  }
  console.log("Email service: Failed to send email after all retry attempts");
  return false;
}
var emailTemplates = {
  queryResolved: (queryTitle, pensionerName) => ({
    subject: `Query Resolved: ${queryTitle}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="cid:preloader" alt="ZESA Logo" style="max-width: 50%; height: 24;" />
      <h2>Query Resolution Notification</h2>
      <p>Dear ${pensionerName},</p>
      <p>We are pleased to inform you that your query "${queryTitle}" has been resolved.</p>
      <p>You can now visit our nearest branch for assistance.</p>
      <p>If you have any further questions, please don't hesitate to contact us.</p>
      <br>
      <p>Best regards,</p>
      <p>ZEIPF WORKFLOW SYSTEM</p>
    </div>
    `
  }),
  claimPaid: (claimNumber, pensionerName, amount) => ({
    subject: `Claim Payment Confirmation: ${claimNumber}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="cid:preloader" alt="Zesa Logo" style="max-width: 50%; height: 24;" />
      <h2>Claim Payment Notification</h2>
      <p>Dear ${pensionerName},</p>
      <p>We are pleased to inform you that your claim (${claimNumber}) has been processed and paid.</p>
      <p>Payment Details:</p>
      <ul>
        <li>Claim Number: ${claimNumber}</li>
        <li>Amount: $ZWL${amount.toLocaleString()}</li>
      </ul>
      <p>The payment should reflect in your account within 2-3 business days.</p>
      <br>
      <p>Best regards,</p>
      <p>ZEIPF WORKFLOW SYSTEM</p>
    </div>
    `
  }),
  newClaimSubmitted: (claimNumber, pensionerName, amount, category, submitterName) => ({
    subject: `New Claim Submission: ${claimNumber}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="cid:preloader" alt="ZESA Logo" style="max-width: 50%; height: 24;" />
      <h2>New Claim Submission Notification</h2>
      <p>Dear Administrator,</p>
      <p>A new claim has been submitted and requires your attention.</p>
      <p>Claim Details:</p>
      <ul>
        <li>Claim Number: ${claimNumber}</li>
        <li>Pensioner Name: ${pensionerName}</li>
        <li>Category: ${category}</li>
        <li>Submitted By: ${submitterName}</li>
        <li>Submission Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}</li>
      </ul>
      <p>Please review this claim at your earliest convenience.</p>
      <br>
      <p>Best regards,</p>
      <p>ZEIPF WORKFLOW SYSTEM</p>
    </div>
    `
  }),
  claimSubmissionConfirmation: (claimNumber, pensionerName, amount, category) => ({
    subject: `Claim Submission Confirmation: ${claimNumber}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="cid:preloader" alt="ZESA Logo" style="max-width: 50%; height: 24;" />
      <h2>Claim Submission Confirmation</h2>
      <p>Dear ${pensionerName},</p>
      <p>We have successfully received your claim submission.</p>
      <p>Claim Details:</p>
      <ul>
        <li>Claim Number: ${claimNumber}</li>
        <li>Category: ${category}</li>
        <li>Submission Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}</li>
      </ul>
      <p>Your claim is now being processed. You will receive updates on the status as it progresses through our review process.</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <br>
      <p>Best regards,</p>
      <p>ZEIPF WORKFLOW SYSTEM </p>
    </div>
    `
  })
};

// server/storage.ts
var MemoryStore = createMemoryStore(session);
var DatabaseStorage = class {
  sessionStore;
  connectionStatus = "connected";
  lastConnectionCheck = Date.now();
  CONNECTION_CHECK_INTERVAL = 6e4;
  // Check every minute
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
    });
  }
  /**
   * Checks database connection health and attempts reconnection if needed
   * @returns boolean indicating if connection is healthy
   */
  async checkDatabaseConnection() {
    const now = Date.now();
    if (this.connectionStatus === "connected" && now - this.lastConnectionCheck < this.CONNECTION_CHECK_INTERVAL) {
      return true;
    }
    this.lastConnectionCheck = now;
    try {
      await db.execute(sql`SELECT 1`);
      if (this.connectionStatus === "error") {
        console.log("Database connection has been restored");
      }
      this.connectionStatus = "connected";
      return true;
    } catch (error) {
      console.error("Database connection check failed:", error);
      this.connectionStatus = "error";
      return false;
    }
  }
  /**
   * Wrapper for database operations with connection checking
   * @param operation Function containing the database operation to perform
   * @returns Result of the operation
   */
  async withConnectionCheck(operation) {
    try {
      await this.checkDatabaseConnection();
      return await operation();
    } catch (error) {
      console.error("Database operation failed:", error);
      await this.checkDatabaseConnection();
      throw error;
    }
  }
  async getUser(zesa_no) {
    console.debug("Looking up user by ZESA number:", zesa_no);
    return this.withConnectionCheck(async () => {
      const [user] = await db.select().from(users).where(eq2(users.zesa_no, zesa_no));
      console.debug("Found user:", user);
      return user;
    });
  }
  async getUserById(id) {
    return this.withConnectionCheck(async () => {
      const [user] = await db.select().from(users).where(eq2(users.id, id));
      return user;
    });
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, updates) {
    const [updatedUser] = await db.update(users).set(updates).where(eq2(users.id, id)).returning();
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  }
  async getAllUsers(limit = 50, offset = 0, searchTerm) {
    return this.withConnectionCheck(async () => {
      return db.select().from(users).where(
        searchTerm ? or(
          sql`${users.username} ILIKE ${`%${searchTerm}%`}`,
          sql`${users.email} ILIKE ${`%${searchTerm}%`}`,
          sql`${users.zesa_no} ILIKE ${`%${searchTerm}%`}`
        ) : void 0
      ).limit(limit).offset(offset).orderBy(users.username);
    });
  }
  async getTotalUsersCount(searchTerm) {
    return this.withConnectionCheck(async () => {
      const result = await db.select({
        count: sql`count(*)::int`
      }).from(users).where(
        searchTerm ? or(
          sql`${users.username} ILIKE ${`%${searchTerm}%`}`,
          sql`${users.email} ILIKE ${`%${searchTerm}%`}`,
          sql`${users.zesa_no} ILIKE ${`%${searchTerm}%`}`
        ) : void 0
      );
      return result[0].count;
    });
  }
  async deleteUser(id) {
    return this.withConnectionCheck(async () => {
      try {
        const user = await this.getUserById(id);
        if (!user) {
          return { success: false, message: "User not found" };
        }
        const superadmins = await db.select().from(users).where(eq2(users.role, "superadmin"));
        if (user.role === "superadmin" && superadmins.length <= 1) {
          return { success: false, message: "Cannot delete the last superadmin" };
        }
        await db.delete(users).where(eq2(users.id, id));
        return { success: true, message: "User deleted successfully" };
      } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, message: "Failed to delete user" };
      }
    });
  }
  async updateUserRole(id, role, changedBy) {
    return this.withConnectionCheck(async () => {
      const targetUser = await this.getUserById(id);
      if (!targetUser) throw new Error("User not found");
      if (targetUser.role === "superadmin" && role === "admin") {
        const superadmins = await db.select().from(users).where(eq2(users.role, "superadmin"));
        if (superadmins.length <= 1) {
          throw new Error("Cannot demote the last superadmin");
        }
      }
      const [updatedUser] = await db.update(users).set({ role }).where(eq2(users.id, id)).returning();
      if (!updatedUser) throw new Error("User not found");
      console.log(`User ${updatedUser.username} role changed from ${targetUser.role} to ${role} by user ID ${changedBy}`);
      return updatedUser;
    });
  }
  // Pensioners CRUD operations
  async getPensioners(limit = 50, offset = 0) {
    return db.select().from(pensioners).limit(limit).offset(offset).orderBy(pensioners.surname);
  }
  async getTotalPensionersCount(searchTerm) {
    const result = await db.select({
      count: sql`count(*)::int`
    }).from(pensioners).where(
      searchTerm ? or(
        sql`${pensioners.firstname} ILIKE ${searchTerm}`,
        sql`${pensioners.surname} ILIKE ${searchTerm}`,
        sql`${pensioners.code} ILIKE ${searchTerm}`,
        sql`${pensioners.nationalidentificationno} ILIKE ${searchTerm}`
      ) : void 0
    );
    return result[0].count;
  }
  async createPensioner(pensioner) {
    const [newPensioner] = await db.insert(pensioners).values(pensioner).returning();
    return newPensioner;
  }
  async updatePensioner(id, pensioner) {
    const [updatedPensioner] = await db.update(pensioners).set(pensioner).where(eq2(pensioners.id, id)).returning();
    if (!updatedPensioner) throw new Error("Pensioner not found");
    return updatedPensioner;
  }
  async deletePensioner(id) {
    try {
      await db.delete(pensioners).where(eq2(pensioners.id, id));
      return { success: true, message: "Pensioner deleted successfully" };
    } catch (error) {
      console.error("Error deleting pensioner:", error);
      throw new Error("Failed to delete pensioner");
    }
  }
  async getPensionerById(id) {
    const results = await db.select().from(pensioners).where(eq2(pensioners.id, id)).limit(1);
    return results.length > 0 ? results[0] : void 0;
  }
  async searchPensioners(searchTerm, limit = 50, offset = 0) {
    return db.select().from(pensioners).where(
      or(
        sql`${pensioners.firstname} ILIKE ${searchTerm}`,
        sql`${pensioners.surname} ILIKE ${searchTerm}`,
        sql`${pensioners.code} ILIKE ${searchTerm}`,
        sql`${pensioners.nationalidentificationno} ILIKE ${searchTerm}`
      )
    ).limit(limit).offset(offset).orderBy(pensioners.surname);
  }
  async createQuery(query) {
    const [newQuery] = await db.insert(queries).values({
      ...query,
      status: "open",
      submittedAt: /* @__PURE__ */ new Date(),
      assignedTo: null
    }).returning();
    return newQuery;
  }
  async getQueries(limit = 50, offset = 0, searchTerm) {
    return db.select().from(queries).where(
      searchTerm ? or(
        sql`${queries.title} ILIKE ${`%${searchTerm}%`}`,
        sql`${queries.pensionerName} ILIKE ${`%${searchTerm}%`}`,
        sql`${queries.description} ILIKE ${`%${searchTerm}%`}`
      ) : void 0
    ).limit(limit).offset(offset).orderBy(desc(queries.submittedAt));
  }
  async getTotalQueriesCount(searchTerm) {
    const result = await db.select({
      count: sql`count(*)::int`
    }).from(queries).where(
      searchTerm ? or(
        sql`${queries.title} ILIKE ${`%${searchTerm}%`}`,
        sql`${queries.pensionerName} ILIKE ${`%${searchTerm}%`}`,
        sql`${queries.description} ILIKE ${`%${searchTerm}%`}`
      ) : void 0
    );
    return result[0].count;
  }
  async updateQueryStatus(id, status, assignedTo) {
    const [oldQuery] = await db.select().from(queries).where(eq2(queries.id, id));
    if (!oldQuery) throw new Error("Query not found");
    if (oldQuery.status === "resolved") {
      throw new Error("Cannot change status of a resolved query");
    }
    const [updatedQuery] = await db.update(queries).set({ status, assignedTo }).where(eq2(queries.id, id)).returning();
    if (oldQuery.status !== status && assignedTo) {
      await this.addQueryStatusHistory(id, oldQuery.status, status, assignedTo);
      if (status === "resolved") {
        const [pensioner] = await db.select().from(pensioners).where(sql`${pensioners.id} = ${oldQuery.pensionerId}`);
        if (pensioner?.email) {
          const emailContent = emailTemplates.queryResolved(
            updatedQuery.title,
            updatedQuery.pensionerName
          );
          await sendEmail({
            to: pensioner.email,
            ...emailContent
          });
        }
      }
    }
    return updatedQuery;
  }
  async createClaim(claim) {
    const claimNumber = nanoid(10).toUpperCase();
    const [newClaim] = await db.insert(claims).values({
      ...claim,
      claimNumber,
      status: "pending",
      submittedAt: /* @__PURE__ */ new Date(),
      approvedBy: null
    }).returning();
    console.log("Claim created:", {
      claimNumber: newClaim.claimNumber,
      pensionerName: newClaim.pensionerName,
      amount: newClaim.amount,
      category: newClaim.category,
      documents: Array.isArray(newClaim.documents) ? newClaim.documents.length : "N/A",
      supervisorEmail: newClaim.supervisorEmail || "Not provided"
    });
    if (newClaim) {
      try {
        let submitterName = "System User";
        let submitterEmail = null;
        if (newClaim.submittedBy) {
          const submitter = await this.getUserById(newClaim.submittedBy);
          if (submitter) {
            submitterName = submitter.username;
            submitterEmail = submitter.email;
          }
        }
        let pensionerInfo = newClaim.pensionerName;
        let pensionerEmail = null;
        if (newClaim.pensionerId) {
          const pensioner = await db.query.pensioners.findFirst({
            where: eq2(pensioners.id, newClaim.pensionerId)
          });
          if (pensioner) {
            pensionerInfo = `${pensioner.firstname || ""} ${pensioner.surname || ""}`.trim();
            if (!pensionerInfo) {
              pensionerInfo = newClaim.pensionerName;
            }
            pensionerEmail = pensioner.email;
          }
        }
        if (newClaim.supervisorEmail) {
          console.log("Sending claim notification email to supervisor:", newClaim.supervisorEmail);
          const supervisorEmailData = emailTemplates.newClaimSubmitted(
            newClaim.claimNumber,
            pensionerInfo,
            newClaim.amount,
            newClaim.category,
            submitterName
          );
          try {
            await logEmailAttempt({
              recipient: newClaim.supervisorEmail,
              subject: supervisorEmailData.subject,
              status: "pending",
              claimId: newClaim.id,
              retryCount: 0
            });
            const supervisorEmailSent = await sendEmail({
              to: newClaim.supervisorEmail,
              ...supervisorEmailData
            });
            console.log(
              "Claim notification email sent to supervisor successfully:",
              supervisorEmailSent
            );
          } catch (emailError) {
            console.error(
              "Error sending claim notification email to supervisor:",
              emailError
            );
          }
        } else {
          console.log("No supervisor email provided for claim notification");
        }
        if (pensionerEmail) {
          console.log("Sending claim confirmation email to pensioner:", pensionerEmail);
          const pensionerEmailData = emailTemplates.claimSubmissionConfirmation(
            newClaim.claimNumber,
            pensionerInfo,
            newClaim.amount,
            newClaim.category
          );
          try {
            await logEmailAttempt({
              recipient: pensionerEmail,
              subject: pensionerEmailData.subject,
              status: "pending",
              claimId: newClaim.id,
              retryCount: 0
            });
            const pensionerEmailSent = await sendEmail({
              to: pensionerEmail,
              ...pensionerEmailData
            });
            console.log(
              "Claim confirmation email sent to pensioner successfully:",
              pensionerEmailSent
            );
          } catch (emailError) {
            console.error(
              "Error sending claim confirmation email to pensioner:",
              emailError
            );
          }
        } else {
          console.log("No pensioner email found for claim confirmation");
        }
        if (!newClaim.supervisorEmail && submitterEmail) {
          console.log("Sending claim notification email to submitter as fallback:", submitterEmail);
          const submitterEmailData = emailTemplates.newClaimSubmitted(
            newClaim.claimNumber,
            pensionerInfo,
            newClaim.amount,
            newClaim.category,
            submitterName
          );
          try {
            await logEmailAttempt({
              recipient: submitterEmail,
              subject: submitterEmailData.subject,
              status: "pending",
              claimId: newClaim.id,
              retryCount: 0
            });
            const submitterEmailSent = await sendEmail({
              to: submitterEmail,
              ...submitterEmailData
            });
            console.log(
              "Claim notification email sent to submitter successfully:",
              submitterEmailSent
            );
          } catch (emailError) {
            console.error(
              "Error sending claim notification email to submitter:",
              emailError
            );
          }
        }
      } catch (error) {
        console.error("Failed to send claim notification emails:", error);
      }
    }
    return newClaim;
  }
  async getClaims(limit = 50, offset = 0, searchTerm) {
    return db.select().from(claims).where(
      searchTerm ? or(
        sql`${claims.pensionerName} ILIKE ${`%${searchTerm}%`}`,
        sql`${claims.claimNumber} ILIKE ${`%${searchTerm}%`}`
      ) : void 0
    ).limit(limit).offset(offset).orderBy(desc(claims.submittedAt));
  }
  async getTotalClaimsCount(searchTerm) {
    const result = await db.select({
      count: sql`count(*)::int`
    }).from(claims).where(
      searchTerm ? or(
        sql`${claims.pensionerName} ILIKE ${`%${searchTerm}%`}`,
        sql`${claims.claimNumber} ILIKE ${`%${searchTerm}%`}`
      ) : void 0
    );
    return result[0].count;
  }
  async updateClaimStatus(id, status, approvedBy) {
    const [oldClaim] = await db.select().from(claims).where(eq2(claims.id, id));
    if (!oldClaim) throw new Error("Claim not found");
    if (oldClaim.status === "paid") {
      throw new Error("Cannot change status of a paid claim");
    }
    const [updatedClaim] = await db.update(claims).set({ status, approvedBy }).where(eq2(claims.id, id)).returning();
    if (oldClaim.status !== status && approvedBy) {
      await this.addClaimStatusHistory(id, oldClaim.status, status, approvedBy);
      if (status === "paid") {
        const [pensioner] = await db.select().from(pensioners).where(sql`${pensioners.id} = ${updatedClaim.pensionerId}`);
        if (pensioner?.email) {
          const emailContent = emailTemplates.claimPaid(
            updatedClaim.claimNumber,
            updatedClaim.pensionerName,
            updatedClaim.amount
          );
          await sendEmail({
            to: pensioner.email,
            ...emailContent
          });
        }
      }
    }
    return updatedClaim;
  }
  async getQueryStatusHistory(queryId) {
    const historyWithUserInfo = await db.select({
      id: queryStatusHistory.id,
      queryId: queryStatusHistory.queryId,
      oldStatus: queryStatusHistory.oldStatus,
      newStatus: queryStatusHistory.newStatus,
      changedAt: queryStatusHistory.changedAt,
      changedBy: queryStatusHistory.changedBy,
      notes: queryStatusHistory.notes,
      // Include user information
      username: users.username,
      userZesaNo: users.zesa_no,
      userRole: users.role
    }).from(queryStatusHistory).leftJoin(users, eq2(queryStatusHistory.changedBy, users.id)).where(eq2(queryStatusHistory.queryId, queryId)).orderBy(desc(queryStatusHistory.changedAt));
    return historyWithUserInfo;
  }
  async getClaimStatusHistory(claimId) {
    const historyWithUserInfo = await db.select({
      id: claimStatusHistory.id,
      claimId: claimStatusHistory.claimId,
      oldStatus: claimStatusHistory.oldStatus,
      newStatus: claimStatusHistory.newStatus,
      changedAt: claimStatusHistory.changedAt,
      changedBy: claimStatusHistory.changedBy,
      notes: claimStatusHistory.notes,
      // Include user information
      username: users.username,
      userZesaNo: users.zesa_no,
      userRole: users.role
    }).from(claimStatusHistory).leftJoin(users, eq2(claimStatusHistory.changedBy, users.id)).where(eq2(claimStatusHistory.claimId, claimId)).orderBy(desc(claimStatusHistory.changedAt));
    return historyWithUserInfo;
  }
  async addQueryStatusHistory(queryId, oldStatus, newStatus, changedBy, notes) {
    const [history] = await db.insert(queryStatusHistory).values({
      queryId,
      oldStatus,
      newStatus,
      changedBy,
      notes
    }).returning();
    return history;
  }
  async addClaimStatusHistory(claimId, oldStatus, newStatus, changedBy, notes) {
    const [history] = await db.insert(claimStatusHistory).values({
      claimId,
      oldStatus,
      newStatus,
      changedBy,
      notes
    }).returning();
    return history;
  }
  // Pensioner Regulations
  async createRegulation(regulation) {
    const [newRegulation] = await db.insert(pensionerRegulations).values({
      ...regulation,
      status: "pending",
      submittedAt: /* @__PURE__ */ new Date()
    }).returning();
    if (newRegulation && newRegulation.supervisorEmail) {
      try {
        let submitterName = "System User";
        if (newRegulation.submittedBy) {
          const submitter = await this.getUserById(newRegulation.submittedBy);
          if (submitter) {
            submitterName = submitter.username;
          }
        }
        const emailContent = {
          subject: `New Pensioner Regulation Request - ${newRegulation.category}`,
          text: `A new pensioner regulation request has been submitted for ${newRegulation.pensionerName} (${newRegulation.pensionerCode}) in the ${newRegulation.category} category by ${submitterName}.

Please review this request at your earliest convenience.`
        };
        await sendEmail({
          to: newRegulation.supervisorEmail,
          ...emailContent
        });
      } catch (error) {
        console.error("Failed to send regulation notification email:", error);
      }
    }
    return newRegulation;
  }
  async getRegulations(limit = 50, offset = 0, searchTerm) {
    console.log(
      "Getting regulations from database with limit:",
      limit,
      "offset:",
      offset,
      "searchTerm:",
      searchTerm
    );
    try {
      const query = db.select().from(pensionerRegulations).where(
        searchTerm ? or(
          sql`${pensionerRegulations.pensionerName} ILIKE ${`%${searchTerm}%`}`,
          sql`${pensionerRegulations.pensionerCode} ILIKE ${`%${searchTerm}%`}`,
          sql`${pensionerRegulations.description} ILIKE ${`%${searchTerm}%`}`
        ) : void 0
      ).limit(limit).offset(offset).orderBy(desc(pensionerRegulations.submittedAt));
      const results = await query;
      console.log(`Found ${results.length} regulations in the database`);
      return results;
    } catch (error) {
      console.error("Error in getRegulations:", error);
      throw error;
    }
  }
  async getTotalRegulationsCount(searchTerm) {
    const result = await db.select({
      count: sql`count(*)::int`
    }).from(pensionerRegulations).where(
      searchTerm ? or(
        sql`${pensionerRegulations.pensionerName} ILIKE ${`%${searchTerm}%`}`,
        sql`${pensionerRegulations.pensionerCode} ILIKE ${`%${searchTerm}%`}`,
        sql`${pensionerRegulations.description} ILIKE ${`%${searchTerm}%`}`
      ) : void 0
    );
    return result[0].count;
  }
  async updateRegulationStatus(id, status, approvedBy) {
    const [oldRegulation] = await db.select().from(pensionerRegulations).where(eq2(pensionerRegulations.id, id));
    if (!oldRegulation) throw new Error("Regulation request not found");
    if (oldRegulation.status !== "pending") {
      throw new Error(
        `Cannot change status of a ${oldRegulation.status} regulation request`
      );
    }
    const [updatedRegulation] = await db.update(pensionerRegulations).set({ status }).where(eq2(pensionerRegulations.id, id)).returning();
    if (oldRegulation.status !== status) {
      await this.addRegulationStatusHistory(
        id,
        oldRegulation.status,
        status,
        approvedBy
      );
      if (oldRegulation.email || oldRegulation.pensionerId && oldRegulation.submittedBy) {
        try {
          let emailRecipient = oldRegulation.email;
          if (!emailRecipient && oldRegulation.pensionerId) {
            const [pensioner] = await db.select().from(pensioners).where(eq2(pensioners.id, oldRegulation.pensionerId));
            if (pensioner?.email) {
              emailRecipient = pensioner.email;
            }
          }
          if (!emailRecipient && oldRegulation.submittedBy) {
            const submitter = await this.getUserById(oldRegulation.submittedBy);
            if (submitter?.email) {
              emailRecipient = submitter.email;
            }
          }
          if (emailRecipient) {
            const emailContent = {
              subject: `Pension Regulation Request ${status === "approved" ? "Approved" : "Rejected"} - ${oldRegulation.category}`,
              text: `Your pension regulation request for ${oldRegulation.pensionerName} (${oldRegulation.pensionerCode}) has been ${status === "approved" ? "approved" : "rejected"}.`
            };
            await sendEmail({
              to: emailRecipient,
              ...emailContent
            });
          }
        } catch (error) {
          console.error(
            "Failed to send regulation status notification email:",
            error
          );
        }
      }
    }
    return updatedRegulation;
  }
  async getRegulationStatusHistory(regulationId) {
    const historyWithUserInfo = await db.select({
      id: regulationStatusHistory.id,
      regulationId: regulationStatusHistory.regulationId,
      oldStatus: regulationStatusHistory.oldStatus,
      newStatus: regulationStatusHistory.newStatus,
      changedAt: regulationStatusHistory.changedAt,
      changedBy: regulationStatusHistory.changedBy,
      notes: regulationStatusHistory.notes,
      // Include user information
      username: users.username,
      userZesaNo: users.zesa_no,
      userRole: users.role
    }).from(regulationStatusHistory).leftJoin(users, eq2(regulationStatusHistory.changedBy, users.id)).where(eq2(regulationStatusHistory.regulationId, regulationId)).orderBy(desc(regulationStatusHistory.changedAt));
    return historyWithUserInfo;
  }
  async addRegulationStatusHistory(regulationId, oldStatus, newStatus, changedBy, notes) {
    const [history] = await db.insert(regulationStatusHistory).values({
      regulationId,
      oldStatus,
      newStatus,
      changedBy,
      notes
    }).returning();
    return history;
  }
};
var storage = new DatabaseStorage();

// server/services/audit-logger.ts
import fs from "fs";
import path from "path";
var AuditLogger = class _AuditLogger {
  static instance;
  logDirectory;
  maxLogFileSize = 50 * 1024 * 1024;
  // 50MB
  maxLogFiles = 100;
  constructor() {
    this.logDirectory = path.join(process.cwd(), "logs", "audit");
    this.ensureLogDirectory();
  }
  static getInstance() {
    if (!_AuditLogger.instance) {
      _AuditLogger.instance = new _AuditLogger();
    }
    return _AuditLogger.instance;
  }
  ensureLogDirectory() {
    try {
      if (!fs.existsSync(this.logDirectory)) {
        fs.mkdirSync(this.logDirectory, { recursive: true });
      }
    } catch (error) {
      console.error("Failed to create audit log directory:", error);
    }
  }
  getCurrentLogFileName() {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return path.join(this.logDirectory, `audit-${today}.jsonl`);
  }
  async rotateLogIfNeeded() {
    const currentLogFile = this.getCurrentLogFileName();
    try {
      if (fs.existsSync(currentLogFile)) {
        const stats = fs.statSync(currentLogFile);
        if (stats.size >= this.maxLogFileSize) {
          const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
          const rotatedFileName = currentLogFile.replace(".jsonl", `-${timestamp2}.jsonl`);
          fs.renameSync(currentLogFile, rotatedFileName);
          await this.cleanupOldLogs();
        }
      }
    } catch (error) {
      console.error("Failed to rotate audit log:", error);
    }
  }
  async cleanupOldLogs() {
    try {
      const files = fs.readdirSync(this.logDirectory).filter((file) => file.startsWith("audit-") && file.endsWith(".jsonl")).map((file) => ({
        name: file,
        path: path.join(this.logDirectory, file),
        mtime: fs.statSync(path.join(this.logDirectory, file)).mtime
      })).sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      if (files.length > this.maxLogFiles) {
        const filesToDelete = files.slice(this.maxLogFiles);
        for (const file of filesToDelete) {
          fs.unlinkSync(file.path);
        }
      }
    } catch (error) {
      console.error("Failed to cleanup old audit logs:", error);
    }
  }
  async log(entry) {
    const logEntry = {
      ...entry,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      await this.rotateLogIfNeeded();
      const logLine = JSON.stringify(logEntry) + "\n";
      const logFile = this.getCurrentLogFileName();
      fs.appendFileSync(logFile, logLine, { encoding: "utf8" });
      if (process.env.NODE_ENV !== "production") {
        console.log(`[AUDIT] ${logEntry.timestamp} - ${logEntry.eventType} - ${logEntry.action} - ${logEntry.success ? "SUCCESS" : "FAILED"}`);
      }
    } catch (error) {
      console.error("Failed to write audit log:", error);
    }
  }
  // Convenience methods for common audit events
  async logAuthentication(eventType, userId, userZesaNo, username, sessionId, ipAddress, userAgent, success, details = {}) {
    await this.log({
      eventType,
      userId,
      userZesaNo,
      username,
      sessionId,
      ipAddress,
      userAgent,
      action: `User ${eventType.toLowerCase().replace("auth_", "")}`,
      success,
      severity: success ? "MEDIUM" : "HIGH",
      details
    });
  }
  async logDataOperation(eventType, userId, userZesaNo, username, resource, resourceId, action, success, details = {}, sessionId, ipAddress) {
    await this.log({
      eventType,
      userId,
      userZesaNo,
      username,
      sessionId,
      ipAddress,
      resource,
      resourceId,
      action,
      success,
      severity: "MEDIUM",
      details
    });
  }
  async logSystemEvent(eventType, action, success, details = {}) {
    await this.log({
      eventType,
      action,
      success,
      severity: eventType === "DATABASE_FAILOVER" ? "HIGH" : "MEDIUM",
      details
    });
  }
  async logFileOperation(eventType, userId, userZesaNo, username, fileName, filePath, fileSize, success, details = {}, sessionId, ipAddress) {
    await this.log({
      eventType,
      userId,
      userZesaNo,
      username,
      sessionId,
      ipAddress,
      resource: "file",
      resourceId: fileName,
      action: `File ${eventType.toLowerCase().replace("file_", "")}`,
      success,
      severity: "LOW",
      details: {
        ...details,
        fileName,
        filePath,
        fileSize
      }
    });
  }
  async logEmailEvent(eventType, userId, userZesaNo, username, recipient, subject, success, details = {}) {
    await this.log({
      eventType,
      userId,
      userZesaNo,
      username,
      resource: "email",
      resourceId: recipient,
      action: `Email ${success ? "sent" : "failed"} to ${recipient}`,
      success,
      severity: success ? "LOW" : "MEDIUM",
      details: {
        ...details,
        recipient,
        subject
      }
    });
  }
  // Query audit logs with filters
  async queryLogs(filters = {}) {
    try {
      const logs = [];
      const files = fs.readdirSync(this.logDirectory).filter((file) => file.startsWith("audit-") && file.endsWith(".jsonl")).sort((a, b) => b.localeCompare(a));
      for (const file of files) {
        const filePath = path.join(this.logDirectory, file);
        const content = fs.readFileSync(filePath, "utf8");
        const lines = content.trim().split("\n").filter((line) => line.trim());
        for (const line of lines) {
          try {
            const entry = JSON.parse(line);
            if (filters.startDate && new Date(entry.timestamp) < filters.startDate) continue;
            if (filters.endDate && new Date(entry.timestamp) > filters.endDate) continue;
            if (filters.eventType && entry.eventType !== filters.eventType) continue;
            if (filters.userId && entry.userId !== filters.userId) continue;
            if (filters.severity && entry.severity !== filters.severity) continue;
            if (filters.success !== void 0 && entry.success !== filters.success) continue;
            logs.push(entry);
            if (filters.limit && logs.length >= filters.limit) {
              return logs;
            }
          } catch (parseError) {
            console.error("Failed to parse audit log line:", parseError);
          }
        }
      }
      return logs;
    } catch (error) {
      console.error("Failed to query audit logs:", error);
      return [];
    }
  }
  // Get audit statistics
  async getAuditStats(days = 30) {
    const startDate = /* @__PURE__ */ new Date();
    startDate.setDate(startDate.getDate() - days);
    const logs = await this.queryLogs({ startDate });
    const stats = {
      totalEvents: logs.length,
      eventsByType: {},
      eventsBySeverity: {},
      successRate: 0,
      failedEvents: 0
    };
    let successCount = 0;
    for (const log2 of logs) {
      stats.eventsByType[log2.eventType] = (stats.eventsByType[log2.eventType] || 0) + 1;
      stats.eventsBySeverity[log2.severity] = (stats.eventsBySeverity[log2.severity] || 0) + 1;
      if (log2.success) {
        successCount++;
      } else {
        stats.failedEvents++;
      }
    }
    stats.successRate = logs.length > 0 ? successCount / logs.length * 100 : 0;
    return stats;
  }
};
var auditLogger = AuditLogger.getInstance();

// server/middleware/audit-middleware.ts
function getClientIpAddress(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress || req.socket.remoteAddress || "unknown";
}
function getEventTypeFromRoute(method, path7) {
  const routeMap = {
    "POST /api/auth/login": "AUTH_LOGIN",
    "POST /api/auth/logout": "AUTH_LOGOUT",
    "POST /api/auth/reset-password": "AUTH_PASSWORD_RESET",
    "POST /api/queries": "QUERY_CREATE",
    "PUT /api/queries": "QUERY_UPDATE",
    "DELETE /api/queries": "QUERY_DELETE",
    "POST /api/claims": "CLAIM_CREATE",
    "PUT /api/claims": "CLAIM_UPDATE",
    "DELETE /api/claims": "CLAIM_DELETE",
    "POST /api/regulations": "REGULATION_CREATE",
    "PUT /api/regulations": "REGULATION_UPDATE",
    "DELETE /api/regulations": "REGULATION_DELETE",
    "POST /api/pensioners": "PENSIONER_CREATE",
    "PUT /api/pensioners": "PENSIONER_UPDATE",
    "DELETE /api/pensioners": "PENSIONER_DELETE",
    "POST /api/users": "USER_CREATE",
    "PUT /api/users": "USER_UPDATE",
    "DELETE /api/users": "USER_DELETE",
    "POST /api/upload": "FILE_UPLOAD",
    "GET /api/reports": "REPORT_GENERATE",
    "GET /api/export": "DATA_EXPORT"
  };
  const key = `${method} ${path7}`;
  return routeMap[key];
}
function getResourceFromRoute(path7) {
  if (path7.includes("/queries")) return "query";
  if (path7.includes("/claims")) return "claim";
  if (path7.includes("/regulations")) return "regulation";
  if (path7.includes("/pensioners")) return "pensioner";
  if (path7.includes("/users")) return "user";
  if (path7.includes("/upload")) return "file";
  if (path7.includes("/reports")) return "report";
  if (path7.includes("/auth")) return "authentication";
  return "unknown";
}
function getActionFromRoute(method, path7) {
  const actions = {
    "GET": "view",
    "POST": "create",
    "PUT": "update",
    "PATCH": "update",
    "DELETE": "delete"
  };
  const baseAction = actions[method] || "unknown";
  const resource = getResourceFromRoute(path7);
  if (path7.includes("/login")) return "login";
  if (path7.includes("/logout")) return "logout";
  if (path7.includes("/reset-password")) return "reset_password";
  if (path7.includes("/status")) return "status_change";
  return `${baseAction}_${resource}`;
}
function initAuditContext(req, res, next) {
  req.auditContext = {
    startTime: Date.now(),
    eventType: getEventTypeFromRoute(req.method, req.path),
    resource: getResourceFromRoute(req.path),
    action: getActionFromRoute(req.method, req.path)
  };
  next();
}
function logAuditEvent(req, res, next) {
  const originalSend = res.send;
  const originalJson = res.json;
  res.send = function(body) {
    logRequestCompletion(req, res, body);
    return originalSend.call(this, body);
  };
  res.json = function(body) {
    logRequestCompletion(req, res, body);
    return originalJson.call(this, body);
  };
  next();
}
async function logRequestCompletion(req, res, responseBody) {
  const auditContext = req.auditContext;
  if (!auditContext) return;
  const duration = Date.now() - auditContext.startTime;
  const success = res.statusCode >= 200 && res.statusCode < 400;
  const ipAddress = getClientIpAddress(req);
  const userAgent = req.headers["user-agent"] || "unknown";
  let resourceId;
  if (req.params.id) {
    resourceId = req.params.id;
  } else if (req.body?.id) {
    resourceId = req.body.id;
  } else if (responseBody?.id) {
    resourceId = responseBody.id;
  }
  const details = {
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    duration,
    requestSize: req.headers["content-length"] ? parseInt(req.headers["content-length"]) : void 0,
    query: Object.keys(req.query).length > 0 ? req.query : void 0
  };
  if (!success && responseBody) {
    if (typeof responseBody === "string") {
      details.error = responseBody;
    } else if (responseBody.error || responseBody.message) {
      details.error = responseBody.error || responseBody.message;
    }
  }
  if (auditContext.eventType || req.method !== "GET" || !success) {
    await auditLogger.log({
      eventType: auditContext.eventType || "FILE_ACCESS",
      // Default for unmatched routes
      userId: req.user?.id,
      userZesaNo: req.user?.zesa_no,
      username: req.user?.username,
      sessionId: req.sessionID,
      ipAddress,
      userAgent,
      resource: auditContext.resource,
      resourceId,
      action: auditContext.action || `${req.method} ${req.path}`,
      success,
      severity: success ? "LOW" : "MEDIUM",
      details
    });
  }
}
async function logAuthenticationEvent(eventType, req, success, details = {}) {
  const ipAddress = getClientIpAddress(req);
  const userAgent = req.headers["user-agent"] || "unknown";
  await auditLogger.logAuthentication(
    eventType,
    req.user?.id,
    req.user?.zesa_no || details.zesa_no,
    req.user?.username || details.username,
    req.sessionID,
    ipAddress,
    userAgent,
    success,
    details
  );
}
async function logDataOperation(eventType, req, resource, resourceId, action, success, details = {}) {
  const ipAddress = getClientIpAddress(req);
  await auditLogger.logDataOperation(
    eventType,
    req.user?.id,
    req.user?.zesa_no,
    req.user?.username,
    resource,
    resourceId,
    action,
    success,
    details,
    req.sessionID,
    ipAddress
  );
}
async function logFileOperation(eventType, req, fileName, filePath, fileSize, success, details = {}) {
  const ipAddress = getClientIpAddress(req);
  await auditLogger.logFileOperation(
    eventType,
    req.user?.id,
    req.user?.zesa_no,
    req.user?.username,
    fileName,
    filePath,
    fileSize,
    success,
    details,
    req.sessionID,
    ipAddress
  );
}

// server/auth.ts
var scryptAsync = promisify(scrypt);
var passwordResetTokens = [];
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(
      {
        usernameField: "zesa_no",
        passwordField: "password"
      },
      async (zesa_no, password, done) => {
        try {
          console.debug("Login attempt:", { zesa_no });
          const user = await storage.getUser(zesa_no);
          console.debug("User lookup result:", user ? "Found" : "Not found");
          if (!user) {
            return done(null, false, { message: "Incorrect ZESA number." });
          }
          const isValidPassword = await comparePasswords(
            password,
            user.password
          );
          console.debug(
            "Password validation:",
            isValidPassword ? "Valid" : "Invalid"
          );
          if (!isValidPassword) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        } catch (err) {
          console.error("Login error:", err);
          return done(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    console.debug("Serializing user:", user.zesa_no);
    done(null, user.zesa_no);
  });
  passport.deserializeUser(async (zesa_no, done) => {
    try {
      console.debug("Deserializing user:", zesa_no);
      const user = await storage.getUser(zesa_no);
      done(null, user);
    } catch (err) {
      console.error("Deserialization error:", err);
      done(err);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      console.debug("Registration attempt:", { zesa_no: req.body.zesa_no });
      const existingUser = await storage.getUser(req.body.zesa_no);
      if (existingUser) {
        console.debug("Registration failed: ZESA number already exists");
        await logAuthenticationEvent("AUTH_FAILED", req, false, {
          zesa_no: req.body.zesa_no,
          reason: "ZESA number already exists",
          action: "registration"
        });
        return res.status(400).json({ message: "ZESA number already exists" });
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      console.debug("User registered successfully:", { zesa_no: user.zesa_no });
      req.login(user, async (err) => {
        if (err) {
          await logAuthenticationEvent("AUTH_FAILED", req, false, {
            zesa_no: user.zesa_no,
            username: user.username,
            error: err.message,
            action: "registration_login"
          });
          return next(err);
        }
        await logAuthenticationEvent("AUTH_LOGIN", req, true, {
          zesa_no: user.zesa_no,
          username: user.username,
          role: user.role,
          action: "registration_auto_login"
        });
        res.status(201).json(user);
      });
    } catch (err) {
      console.error("Registration error:", err);
      await logAuthenticationEvent("AUTH_FAILED", req, false, {
        zesa_no: req.body.zesa_no,
        error: err instanceof Error ? err.message : String(err),
        action: "registration"
      });
      next(err);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    console.debug("Login request received:", { body: req.body });
    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        console.error("Authentication error:", err);
        await logAuthenticationEvent("AUTH_FAILED", req, false, {
          zesa_no: req.body.zesa_no,
          error: err.message,
          reason: "system_error"
        });
        return next(err);
      }
      if (!user) {
        console.debug("Authentication failed:", info?.message);
        await logAuthenticationEvent("AUTH_FAILED", req, false, {
          zesa_no: req.body.zesa_no,
          reason: info?.message || "Login failed"
        });
        return res.status(400).json({ message: info?.message || "Login failed" });
      }
      req.login(user, async (err2) => {
        if (err2) {
          console.error("Login error:", err2);
          await logAuthenticationEvent("AUTH_FAILED", req, false, {
            zesa_no: user.zesa_no,
            error: err2.message,
            reason: "session_error"
          });
          return next(err2);
        }
        console.debug("Login successful:", { zesa_no: user.zesa_no });
        await logAuthenticationEvent("AUTH_LOGIN", req, true, {
          zesa_no: user.zesa_no,
          username: user.username,
          role: user.role
        });
        res.status(200).json(user);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    const zesa_no = req.user?.zesa_no;
    const username = req.user?.username;
    console.debug("Logout request:", { zesa_no });
    req.logout(async (err) => {
      if (err) {
        console.error("Logout error:", err);
        await logAuthenticationEvent("AUTH_LOGOUT", req, false, {
          zesa_no,
          username,
          error: err.message
        });
        return next(err);
      }
      console.debug("Logout successful:", { zesa_no });
      await logAuthenticationEvent("AUTH_LOGOUT", req, true, {
        zesa_no,
        username
      });
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      console.debug("Unauthenticated user request");
      return res.sendStatus(401);
    }
    console.debug("User info requested:", { zesa_no: req.user?.zesa_no });
    res.json(req.user);
  });
  app2.post("/api/forgot-password", async (req, res) => {
    try {
      const { zesa_no } = req.body;
      console.debug("Password reset request:", { zesa_no });
      if (!zesa_no) {
        return res.status(400).json({ message: "ZESA number is required" });
      }
      const user = await storage.getUser(zesa_no);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!user.email) {
        return res.status(400).json({ message: "User does not have an email address" });
      }
      const token = randomBytes(32).toString("hex");
      const expires = /* @__PURE__ */ new Date();
      expires.setHours(expires.getHours() + 1);
      const existingTokenIndex = passwordResetTokens.findIndex(
        (t) => t.zesa_no === zesa_no
      );
      if (existingTokenIndex !== -1) {
        passwordResetTokens.splice(existingTokenIndex, 1);
      }
      passwordResetTokens.push({ token, expires, zesa_no });
      const resetLink = `${process.env.APP_URL || "https://zesa-pension-tracker.replit.app"}/reset-password?token=${token}`;
      const emailSent = await sendEmail({
        to: user.email,
        subject: "ZESA Pension Fund - Password Reset",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>Dear ${user.username},</p>
            <p>We received a request to reset your password. Click the link below to reset your password:</p>
            <p><a href="${resetLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <br>
            <p>Best regards,</p>
            <p>ZESA Pension Fund Team</p>
          </div>
        `
      });
      if (!emailSent) {
        console.error("Failed to send password reset email");
        await logAuthenticationEvent("AUTH_PASSWORD_RESET", req, false, {
          zesa_no,
          username: user.username,
          email: user.email,
          reason: "Failed to send email"
        });
        return res.status(500).json({
          message: "Failed to send password reset email. Please try again later."
        });
      }
      await logAuthenticationEvent("AUTH_PASSWORD_RESET", req, true, {
        zesa_no,
        username: user.username,
        email: user.email,
        action: "reset_email_sent"
      });
      res.json({ message: "Password reset instructions sent to your email" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "An error occurred while processing your request" });
    }
  });
  app2.get("/api/reset-password/:token", (req, res) => {
    const { token } = req.params;
    const now = /* @__PURE__ */ new Date();
    const resetToken = passwordResetTokens.find(
      (t) => t.token === token && t.expires > now
    );
    if (!resetToken) {
      return res.status(400).json({ valid: false, message: "Invalid or expired token" });
    }
    res.json({ valid: true });
  });
  app2.post("/api/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }
      const now = /* @__PURE__ */ new Date();
      const resetTokenIndex = passwordResetTokens.findIndex(
        (t) => t.token === token && t.expires > now
      );
      if (resetTokenIndex === -1) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      const resetToken = passwordResetTokens[resetTokenIndex];
      const user = await storage.getUser(resetToken.zesa_no);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(user.id, { password: hashedPassword });
      passwordResetTokens.splice(resetTokenIndex, 1);
      await logAuthenticationEvent("AUTH_PASSWORD_RESET", req, true, {
        zesa_no: user.zesa_no,
        username: user.username,
        action: "password_reset_completed"
      });
      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "An error occurred while resetting your password" });
    }
  });
}

// server/routes.ts
init_schema();
init_schema();
init_db();
import { sql as sql2 } from "drizzle-orm";

// server/utils/file-handler.ts
import fs2 from "fs";
import path2 from "path";
function ensureDirectoryExists(dirPath) {
  if (!fs2.existsSync(dirPath)) {
    fs2.mkdirSync(dirPath, { recursive: true });
  }
}
function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}
function createUserUploadPath(code) {
  const sanitizedCode = sanitizeFilename(code);
  const uploadsDir = path2.join(process.cwd(), "uploads");
  const codeDir = path2.join(uploadsDir, sanitizedCode);
  ensureDirectoryExists(uploadsDir);
  ensureDirectoryExists(codeDir);
  return codeDir;
}
function generateUniqueFilename(originalName, prefix) {
  const timestamp2 = Date.now();
  const extension = path2.extname(originalName);
  const baseName = path2.basename(originalName, extension);
  const sanitizedBaseName = sanitizeFilename(baseName);
  if (prefix) {
    const sanitizedPrefix = sanitizeFilename(prefix);
    return `${sanitizedPrefix}_${sanitizedBaseName}_${timestamp2}${extension}`;
  }
  return `${sanitizedBaseName}_${timestamp2}${extension}`;
}
function validateFile(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/tiff", "image/bmp", "application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `File type not allowed: ${file.name}. Only JPEG, PNG, GIF, TIFF, BMP, and PDF are accepted.`
    };
  }
  const MAX_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return {
      isValid: false,
      error: `File too large: ${file.name}. Maximum file size is 2MB.`
    };
  }
  return { isValid: true };
}

// server/routes.ts
import path3 from "path";

// server/routes/audit-routes.ts
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}
function ensureSuperAdmin(req, res, next) {
  if (req.user?.role === "superadmin") return next();
  res.status(403).json({ message: "Forbidden" });
}
function registerAuditRoutes(app2) {
  app2.get("/api/audit/dashboard", ensureAuthenticated, ensureSuperAdmin, async (req, res) => {
    try {
      const { days = 30 } = req.query;
      const daysNumber = parseInt(days);
      const startDate = /* @__PURE__ */ new Date();
      startDate.setDate(startDate.getDate() - daysNumber);
      const [
        allLogs,
        authFailures,
        securityEvents,
        recentActivity
      ] = await Promise.all([
        auditLogger.queryLogs({ startDate, limit: 1e4 }),
        auditLogger.queryLogs({ startDate, eventType: "AUTH_FAILED", limit: 100 }),
        auditLogger.queryLogs({ startDate, severity: "HIGH", limit: 100 }),
        auditLogger.queryLogs({ limit: 50 })
        // Most recent 50 events
      ]);
      const totalEvents = allLogs.length;
      const successfulEvents = allLogs.filter((log2) => log2.success).length;
      const failedEvents = totalEvents - successfulEvents;
      const successRate = totalEvents > 0 ? successfulEvents / totalEvents * 100 : 0;
      const eventTypeDistribution = allLogs.reduce((acc, log2) => {
        acc[log2.eventType] = (acc[log2.eventType] || 0) + 1;
        return acc;
      }, {});
      const dailyActivity = allLogs.reduce((acc, log2) => {
        const date2 = log2.timestamp.split("T")[0];
        if (!acc[date2]) acc[date2] = { date: date2, events: 0, successes: 0, failures: 0 };
        acc[date2].events++;
        if (log2.success) acc[date2].successes++;
        else acc[date2].failures++;
        return acc;
      }, {});
      const userActivity = allLogs.reduce((acc, log2) => {
        if (log2.userZesaNo) {
          const key = `${log2.userZesaNo}|${log2.username || "Unknown"}`;
          if (!acc[key]) acc[key] = { zesaNo: log2.userZesaNo, username: log2.username || "Unknown", events: 0, failures: 0 };
          acc[key].events++;
          if (!log2.success) acc[key].failures++;
        }
        return acc;
      }, {});
      const securityAlerts = securityEvents.filter(
        (event) => event.severity === "HIGH" || event.severity === "CRITICAL"
      ).slice(0, 10);
      const ipAnalysis = authFailures.reduce((acc, log2) => {
        const ip = log2.ipAddress || "unknown";
        if (!acc[ip]) acc[ip] = { ip, attempts: 0, firstAttempt: log2.timestamp, lastAttempt: log2.timestamp };
        acc[ip].attempts++;
        if (log2.timestamp > acc[ip].lastAttempt) acc[ip].lastAttempt = log2.timestamp;
        return acc;
      }, {});
      const topSuspiciousIPs = Object.values(ipAnalysis).sort((a, b) => b.attempts - a.attempts).slice(0, 10);
      res.json({
        success: true,
        period: `${daysNumber} days`,
        metrics: {
          totalEvents,
          successfulEvents,
          failedEvents,
          successRate: Math.round(successRate * 100) / 100,
          authFailures: authFailures.length,
          securityEvents: securityEvents.length
        },
        charts: {
          eventTypeDistribution,
          dailyActivity: Object.values(dailyActivity).sort((a, b) => a.date.localeCompare(b.date)),
          userActivity: Object.values(userActivity).sort((a, b) => b.events - a.events).slice(0, 10)
        },
        alerts: {
          securityAlerts,
          topSuspiciousIPs
        },
        recentActivity: recentActivity.slice(0, 20)
      });
    } catch (error) {
      console.error("Error fetching audit dashboard:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch audit dashboard",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/audit/logs", ensureAuthenticated, ensureSuperAdmin, async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        eventType,
        userId,
        severity,
        success,
        limit = 100,
        search
      } = req.query;
      const filters = {};
      if (startDate) filters.startDate = new Date(startDate);
      if (endDate) filters.endDate = new Date(endDate);
      if (eventType) filters.eventType = eventType;
      if (userId) filters.userId = parseInt(userId);
      if (severity) filters.severity = severity;
      if (success !== void 0) filters.success = success === "true";
      if (limit) filters.limit = parseInt(limit);
      let logs = await auditLogger.queryLogs(filters);
      if (search) {
        const searchTerm = search.toLowerCase();
        logs = logs.filter(
          (log2) => log2.action.toLowerCase().includes(searchTerm) || log2.userZesaNo?.toLowerCase().includes(searchTerm) || log2.username?.toLowerCase().includes(searchTerm) || log2.eventType.toLowerCase().includes(searchTerm) || JSON.stringify(log2.details).toLowerCase().includes(searchTerm)
        );
      }
      res.json({
        success: true,
        logs,
        count: logs.length,
        filters
      });
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch audit logs",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/audit/stats", ensureAuthenticated, ensureSuperAdmin, async (req, res) => {
    try {
      const { days = 30 } = req.query;
      const stats = await auditLogger.getAuditStats(parseInt(days));
      res.json({
        success: true,
        stats,
        period: `${days} days`
      });
    } catch (error) {
      console.error("Error fetching audit statistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch audit statistics",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/audit/security", ensureAuthenticated, ensureSuperAdmin, async (req, res) => {
    try {
      const { days = 7 } = req.query;
      const startDate = /* @__PURE__ */ new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      const securityEvents = await auditLogger.queryLogs({
        startDate,
        severity: "HIGH",
        limit: 200
      });
      const criticalEvents = await auditLogger.queryLogs({
        startDate,
        severity: "CRITICAL",
        limit: 200
      });
      const allEvents = [...securityEvents, ...criticalEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.json({
        success: true,
        events: allEvents,
        count: allEvents.length,
        period: `${days} days`
      });
    } catch (error) {
      console.error("Error fetching security events:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch security events",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/audit/failed-auth", ensureAuthenticated, ensureSuperAdmin, async (req, res) => {
    try {
      const { days = 7 } = req.query;
      const startDate = /* @__PURE__ */ new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      const failedAuthEvents = await auditLogger.queryLogs({
        startDate,
        eventType: "AUTH_FAILED",
        limit: 500
      });
      const ipAnalysis = {};
      failedAuthEvents.forEach((event) => {
        const ip = event.ipAddress || "unknown";
        if (!ipAnalysis[ip]) {
          ipAnalysis[ip] = {
            count: 0,
            attempts: [],
            firstAttempt: event.timestamp,
            lastAttempt: event.timestamp
          };
        }
        ipAnalysis[ip].count++;
        ipAnalysis[ip].attempts.push(event);
        if (event.timestamp > ipAnalysis[ip].lastAttempt) {
          ipAnalysis[ip].lastAttempt = event.timestamp;
        }
        if (event.timestamp < ipAnalysis[ip].firstAttempt) {
          ipAnalysis[ip].firstAttempt = event.timestamp;
        }
      });
      const sortedIpAnalysis = Object.entries(ipAnalysis).sort(([, a], [, b]) => b.count - a.count).slice(0, 50);
      res.json({
        success: true,
        events: failedAuthEvents,
        count: failedAuthEvents.length,
        ipAnalysis: sortedIpAnalysis,
        period: `${days} days`
      });
    } catch (error) {
      console.error("Error fetching failed authentication events:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch failed authentication events",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/audit/user/:userId", ensureAuthenticated, ensureSuperAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const { days = 30 } = req.query;
      const startDate = /* @__PURE__ */ new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      const userActivity = await auditLogger.queryLogs({
        startDate,
        userId: parseInt(userId),
        limit: 1e3
      });
      const timeline = {};
      userActivity.forEach((event) => {
        const date2 = event.timestamp.split("T")[0];
        if (!timeline[date2]) {
          timeline[date2] = [];
        }
        timeline[date2].push(event);
      });
      res.json({
        success: true,
        activity: userActivity,
        timeline,
        count: userActivity.length,
        period: `${days} days`
      });
    } catch (error) {
      console.error("Error fetching user activity:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user activity",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/audit/export", ensureAuthenticated, ensureSuperAdmin, async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        eventType,
        format = "json"
      } = req.query;
      const filters = {};
      if (startDate) filters.startDate = new Date(startDate);
      if (endDate) filters.endDate = new Date(endDate);
      if (eventType) filters.eventType = eventType;
      const logs = await auditLogger.queryLogs(filters);
      if (format === "csv") {
        const csvHeaders = [
          "timestamp",
          "eventType",
          "userId",
          "userZesaNo",
          "username",
          "action",
          "success",
          "severity",
          "ipAddress",
          "resource",
          "resourceId"
        ];
        const csvRows = logs.map((log2) => [
          log2.timestamp,
          log2.eventType,
          log2.userId || "",
          log2.userZesaNo || "",
          log2.username || "",
          log2.action,
          log2.success,
          log2.severity,
          log2.ipAddress || "",
          log2.resource || "",
          log2.resourceId || ""
        ]);
        const csvContent = [csvHeaders, ...csvRows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="audit-logs-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv"`);
        res.send(csvContent);
      } else {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="audit-logs-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json"`);
        res.json({
          exportDate: (/* @__PURE__ */ new Date()).toISOString(),
          filters,
          count: logs.length,
          logs
        });
      }
    } catch (error) {
      console.error("Error exporting audit logs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export audit logs",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
}

// server/routes.ts
function ensureAuthenticated2(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}
function ensureSuperAdmin2(req, res, next) {
  if (req.user?.role === "superadmin") return next();
  res.status(403).json({ message: "Forbidden" });
}
async function registerRoutes(app2) {
  const { checkDatabaseHealth, forceDbConnectionSwitch } = await Promise.resolve().then(() => (init_db(), db_exports));
  app2.get("/api/admin/db-health", ensureAuthenticated2, ensureSuperAdmin2, async (req, res) => {
    try {
      const status = await checkDatabaseHealth();
      res.json({
        healthy: status.healthy,
        currentDatabase: status.type,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      res.status(500).json({
        healthy: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.post("/api/admin/db-switch", ensureAuthenticated2, ensureSuperAdmin2, async (req, res) => {
    try {
      const { target } = req.body;
      if (!target || target !== "neon" && target !== "postgres") {
        return res.status(400).json({
          success: false,
          message: "Invalid target database. Must be 'neon' or 'postgres'"
        });
      }
      const result = await forceDbConnectionSwitch(target);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "Failed to switch database connection"
      });
    }
  });
  setupAuth(app2);
  registerAuditRoutes(app2);
  app2.get("/api/users", ensureAuthenticated2, ensureSuperAdmin2, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 50;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      const allUsers = await storage.getAllUsers(limit, offset, search);
      const total = await storage.getTotalUsersCount(search);
      const usersWithoutPasswords = allUsers.map(({ password, ...user }) => user);
      res.json({
        users: usersWithoutPasswords,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        itemsPerPage: limit
      });
      await logDataOperation(
        "USER_VIEW_ALL",
        req,
        "user",
        void 0,
        "View all users",
        true,
        {
          totalUsers: total,
          page,
          search: search || void 0
        }
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      await logDataOperation(
        "USER_VIEW_ALL",
        req,
        "user",
        void 0,
        "View all users",
        false,
        {
          error: error instanceof Error ? error.message : String(error)
        }
      );
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  app2.patch("/api/users/:id/role", ensureAuthenticated2, ensureSuperAdmin2, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      const currentUserId = req.user.id;
      if (!role || !["admin", "superadmin", "supervisor"].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'admin', 'superadmin', or 'supervisor'" });
      }
      if (userId === currentUserId) {
        return res.status(400).json({ message: "Cannot change your own role" });
      }
      const updatedUser = await storage.updateUserRole(userId, role, currentUserId);
      const { password, ...userWithoutPassword } = updatedUser;
      await logDataOperation(
        "USER_ROLE_CHANGE",
        req,
        "user",
        userId,
        `Change user role to ${role}`,
        true,
        {
          targetUserId: userId,
          targetUsername: updatedUser.username,
          newRole: role,
          changedBy: currentUserId
        }
      );
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user role:", error);
      const userId = parseInt(req.params.id);
      await logDataOperation(
        "USER_ROLE_CHANGE",
        req,
        "user",
        userId,
        `Change user role to ${req.body.role}`,
        false,
        {
          error: error instanceof Error ? error.message : String(error),
          targetUserId: userId,
          attemptedRole: req.body.role
        }
      );
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update user role" });
    }
  });
  app2.delete("/api/users/:id", ensureAuthenticated2, ensureSuperAdmin2, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUserId = req.user.id;
      if (userId === currentUserId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      const userToDelete = await storage.getUserById(userId);
      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }
      const result = await storage.deleteUser(userId);
      if (result.success) {
        await logDataOperation(
          "USER_DELETE",
          req,
          "user",
          userId,
          "Delete user",
          true,
          {
            deletedUserId: userId,
            deletedUsername: userToDelete.username,
            deletedUserRole: userToDelete.role,
            deletedBy: currentUserId
          }
        );
      } else {
        await logDataOperation(
          "USER_DELETE",
          req,
          "user",
          userId,
          "Delete user",
          false,
          {
            error: result.message,
            targetUserId: userId,
            targetUsername: userToDelete.username
          }
        );
      }
      res.json(result);
    } catch (error) {
      console.error("Error deleting user:", error);
      const userId = parseInt(req.params.id);
      await logDataOperation(
        "USER_DELETE",
        req,
        "user",
        userId,
        "Delete user",
        false,
        {
          error: error instanceof Error ? error.message : String(error),
          targetUserId: userId
        }
      );
      res.status(500).json({ message: "Error deleting user" });
    }
  });
  app2.get("/api/pensioners", ensureAuthenticated2, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 50;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let allPensioners;
      let total;
      if (search) {
        const searchTerm = `%${search}%`;
        allPensioners = await storage.searchPensioners(searchTerm, limit, offset);
        total = await storage.getTotalPensionersCount(searchTerm);
      } else {
        allPensioners = await storage.getPensioners(limit, offset);
        total = await storage.getTotalPensionersCount();
      }
      res.json({
        pensioners: allPensioners,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        itemsPerPage: limit
      });
    } catch (error) {
      console.error("Error fetching pensioners:", error);
      res.status(500).json({ message: "Error fetching pensioners" });
    }
  });
  app2.post("/api/pensioners", ensureAuthenticated2, ensureSuperAdmin2, async (req, res) => {
    try {
      const pensioner = await storage.createPensioner(req.body);
      await logDataOperation(
        "PENSIONER_CREATE",
        req,
        "pensioner",
        pensioner.id,
        "Create pensioner",
        true,
        {
          pensionerCode: pensioner.code,
          pensionerName: pensioner.name
        }
      );
      res.status(201).json(pensioner);
    } catch (error) {
      console.error("Error creating pensioner:", error);
      await logDataOperation(
        "PENSIONER_CREATE",
        req,
        "pensioner",
        void 0,
        "Create pensioner",
        false,
        {
          error: error instanceof Error ? error.message : String(error),
          requestData: req.body
        }
      );
      res.status(400).json({ message: "Invalid pensioner data" });
    }
  });
  app2.patch("/api/pensioners/:id", ensureAuthenticated2, ensureSuperAdmin2, async (req, res) => {
    try {
      const pensioner = await storage.updatePensioner(parseInt(req.params.id), req.body);
      res.json(pensioner);
    } catch (error) {
      console.error("Error updating pensioner:", error);
      res.status(404).json({ message: "Pensioner not found" });
    }
  });
  app2.patch("/api/pensioners/:id/stop-order", ensureAuthenticated2, ensureSuperAdmin2, async (req, res) => {
    try {
      const pensioner = await storage.updatePensioner(parseInt(req.params.id), {
        hasStopOrder: req.body.hasStopOrder === true
      });
      res.json(pensioner);
    } catch (error) {
      console.error("Error applying stop order:", error);
      res.status(404).json({ message: "Pensioner not found" });
    }
  });
  app2.delete("/api/pensioners/:id", ensureAuthenticated2, ensureSuperAdmin2, async (req, res) => {
    try {
      const result = await storage.deletePensioner(parseInt(req.params.id));
      res.json(result);
    } catch (error) {
      console.error("Error deleting pensioner:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete pensioner"
      });
    }
  });
  app2.get("/api/pensioners/search", ensureAuthenticated2, async (req, res) => {
    try {
      const query = req.query.q;
      if (!query || query.length < 3) {
        return res.json([]);
      }
      const searchTerm = `%${query}%`;
      const results = await storage.searchPensioners(searchTerm);
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Error searching pensioners" });
    }
  });
  app2.get("/api/pensioners/:id", ensureAuthenticated2, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid pensioner ID" });
      }
      const pensioner = await storage.getPensionerById(id);
      if (!pensioner) {
        return res.status(404).json({ message: "Pensioner not found" });
      }
      res.json(pensioner);
    } catch (error) {
      console.error("Error fetching pensioner by ID:", error);
      res.status(500).json({ message: "Error fetching pensioner details" });
    }
  });
  app2.post("/api/queries", ensureAuthenticated2, async (req, res) => {
    try {
      const userId = req.user.id;
      let documentPaths = [];
      if (req.files && Object.keys(req.files).length > 0) {
        const files = req.files.documents ? Array.isArray(req.files.documents) ? req.files.documents : [req.files.documents] : [];
        const formData2 = JSON.parse(req.body.formData || "{}");
        let pensionerCode = formData2.pensionerCode || "unknown";
        if (formData2.pensionerId && !formData2.pensionerCode) {
          try {
            const pensioner = await storage.getPensionerById(formData2.pensionerId);
            if (pensioner) {
              pensionerCode = pensioner.code;
            }
          } catch (error) {
            console.error("Error getting pensioner details:", error);
          }
        }
        const pensionerUploadPath = createUserUploadPath(pensionerCode);
        for (const file of files) {
          const validation = validateFile(file);
          if (!validation.isValid) {
            return res.status(400).json({ message: validation.error });
          }
          const queryTitle = sanitizeFilename(formData2.title || "query").substring(0, 20);
          const filePrefix = `query_${queryTitle}`;
          const safeFileName = generateUniqueFilename(file.name, filePrefix);
          const fullUploadPath = path3.join(pensionerUploadPath, safeFileName);
          await file.mv(fullUploadPath);
          const relativePath = `/uploads/${pensionerCode}/${safeFileName}`;
          await logFileOperation(
            "FILE_UPLOAD",
            req,
            file.name,
            relativePath,
            file.size,
            true,
            {
              mimeType: file.mimetype,
              pensionerCode,
              context: "query_creation",
              originalName: file.name,
              newName: safeFileName
            }
          );
          documentPaths.push({
            path: relativePath,
            originalName: file.name,
            mimeType: file.mimetype,
            size: file.size
          });
        }
      }
      let formData = {};
      if (req.body.formData) {
        formData = JSON.parse(req.body.formData || "{}");
      } else {
        formData = req.body;
      }
      const parsedData = {
        ...formData,
        documents: documentPaths,
        email: formData.email || null,
        pensionerId: formData.pensionerId === void 0 ? null : formData.pensionerId,
        supervisorEmail: formData.supervisorEmail || null,
        submittedBy: userId
      };
      const data = insertQuerySchema.parse(parsedData);
      const query = await storage.createQuery(data);
      await logDataOperation(
        "QUERY_CREATE",
        req,
        "query",
        query.id,
        "Create query",
        true,
        {
          queryTitle: query.title,
          category: query.category,
          pensionerName: query.pensionerName,
          documentsCount: documentPaths.length,
          supervisorEmail: query.supervisorEmail
        }
      );
      try {
        let pensionerDetails = null;
        if (query.pensionerId) {
          const allPensioners = await storage.getPensioners(1e3, 0);
          pensionerDetails = allPensioners.find((p) => p.id === query.pensionerId);
        }
        const userInfo = await storage.getUserById(userId);
        const emailRecipient = query.supervisorEmail || userInfo?.email;
        if (emailRecipient) {
          const emailSubject = `New Query Submission: ${query.title}`;
          const emailHtml = `
            <h2>New Query Submission</h2>
            <p><strong>Query ID:</strong> ${query.id}</p>
            <p><strong>Title:</strong> ${query.title}</p>
            <p><strong>Category:</strong> ${query.category}</p>
            <p><strong>Description:</strong> ${query.description}</p>
            <p><strong>Submitted By:</strong> ${userInfo?.username} (${userInfo?.zesa_no})</p>
            <p><strong>Pensioner:</strong> ${query.pensionerName}</p>
            ${pensionerDetails ? `
              <h3>Pensioner Details</h3>
              <p><strong>Code:</strong> ${pensionerDetails.code}</p>
              <p><strong>National ID:</strong> ${pensionerDetails.nationalidentificationno || "N/A"}</p>
              <p><strong>Department:</strong> ${pensionerDetails.department || "N/A"}</p>
              <p><strong>Email:</strong> ${pensionerDetails.email || "N/A"}</p>
              <p><strong>Phone:</strong> ${pensionerDetails.phoneno || "N/A"}</p>
            ` : ""}
            <p><strong>Attached Documents:</strong> ${query.documents.length} document(s)</p>
            <p>Please login to the ZESA Pension Fund Management System to review this query.</p>
          `;
          await sendQueryEmail({
            to: emailRecipient,
            subject: emailSubject,
            html: emailHtml
          }, query.id);
          console.log(`Notification email sent to ${emailRecipient} for query #${query.id}`);
        }
      } catch (emailError) {
        console.error("Error sending notification email:", emailError);
      }
      res.status(201).json(query);
    } catch (error) {
      console.error("Error creating query:", error);
      await logDataOperation(
        "QUERY_CREATE",
        req,
        "query",
        void 0,
        "Create query",
        false,
        {
          error: error instanceof Error ? error.message : String(error),
          requestData: req.body
        }
      );
      res.status(400).json({ message: "Invalid query data", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/queries", ensureAuthenticated2, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;
      const searchTerm = req.query.search || void 0;
      const queries2 = await storage.getQueries(limit, offset, searchTerm);
      const total = await storage.getTotalQueriesCount(searchTerm);
      const totalPages = Math.ceil(total / limit);
      res.json({
        queries: queries2,
        total,
        currentPage: page,
        totalPages,
        itemsPerPage: limit
      });
    } catch (error) {
      console.error("Error fetching queries:", error);
      res.status(500).json({ message: "Error fetching queries" });
    }
  });
  app2.get("/api/queries/history", ensureAuthenticated2, async (_req, res) => {
    try {
      const allQueries = await storage.getQueries(1e3, 0);
      const history = await Promise.all(
        allQueries.map(async (query) => {
          const queryHistory = await storage.getQueryStatusHistory(query.id);
          return queryHistory;
        })
      );
      res.json(history.flat());
    } catch (error) {
      console.error("Error fetching query history:", error);
      res.status(500).json({ message: "Error fetching query history" });
    }
  });
  app2.patch("/api/queries/:id/status", ensureAuthenticated2, async (req, res) => {
    try {
      const { status, notes } = req.body;
      const queryId = parseInt(req.params.id);
      const allQueries = await storage.getQueries(1e3, 0);
      const currentQuery = allQueries.find((q) => q.id === queryId);
      if (!currentQuery) {
        return res.status(404).json({ message: "Query not found" });
      }
      const query = await storage.updateQueryStatus(
        queryId,
        status,
        req.user?.id
      );
      if (currentQuery.status !== status && req.user?.id) {
        await storage.addQueryStatusHistory(
          queryId,
          currentQuery.status,
          status,
          req.user.id,
          notes
        );
      }
      res.json(query);
    } catch (error) {
      console.error("Error updating query status:", error);
      res.status(404).json({ message: "Query not found" });
    }
  });
  app2.post("/api/claims", ensureAuthenticated2, async (req, res) => {
    try {
      const userId = req.user.id;
      let documentPaths = [];
      if (req.files && Object.keys(req.files).length > 0) {
        const files = req.files.documents ? Array.isArray(req.files.documents) ? req.files.documents : [req.files.documents] : [];
        const formData2 = JSON.parse(req.body.formData || "{}");
        let pensionerCode = formData2.pensionerCode || "unknown";
        if (formData2.pensionerId && !formData2.pensionerCode) {
          try {
            const pensioner = await storage.getPensionerById(formData2.pensionerId);
            if (pensioner) {
              pensionerCode = pensioner.code;
            }
          } catch (error) {
            console.error("Error getting pensioner details:", error);
          }
        }
        const pensionerUploadPath = createUserUploadPath(pensionerCode);
        for (const file of files) {
          const validation = validateFile(file);
          if (!validation.isValid) {
            return res.status(400).json({ message: validation.error });
          }
          const claimType = sanitizeFilename(formData2.category || "claim").substring(0, 20);
          const filePrefix = `claim_${claimType}`;
          const safeFileName = generateUniqueFilename(file.name, filePrefix);
          const fullUploadPath = path3.join(pensionerUploadPath, safeFileName);
          await file.mv(fullUploadPath);
          const relativePath = `/uploads/${pensionerCode}/${safeFileName}`;
          documentPaths.push({
            path: relativePath,
            originalName: file.name,
            mimeType: file.mimetype,
            size: file.size
          });
        }
      }
      const formData = JSON.parse(req.body.formData || "{}");
      const parsedData = {
        ...formData,
        documents: documentPaths,
        pensionerId: formData.pensionerId === void 0 ? null : formData.pensionerId,
        category: formData.category || "Retirement",
        submittedBy: userId,
        // Add the authenticated user's ID
        supervisorEmail: formData.supervisorEmail || null
        // Add the supervisor's email if provided
      };
      const data = insertClaimSchema.parse(parsedData);
      const claim = await storage.createClaim(data);
      res.status(201).json(claim);
    } catch (error) {
      console.error("Error creating claim:", error);
      res.status(400).json({ message: "Invalid claim data", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/claims", ensureAuthenticated2, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;
      const searchTerm = req.query.search || void 0;
      const claims2 = await storage.getClaims(limit, offset, searchTerm);
      const total = await storage.getTotalClaimsCount(searchTerm);
      const totalPages = Math.ceil(total / limit);
      res.json({
        claims: claims2,
        total,
        currentPage: page,
        totalPages,
        itemsPerPage: limit
      });
    } catch (error) {
      console.error("Error fetching claims:", error);
      res.status(500).json({ message: "Error fetching claims" });
    }
  });
  app2.get("/api/claims/history", ensureAuthenticated2, async (_req, res) => {
    try {
      const allClaims = await storage.getClaims(1e3, 0);
      const history = await Promise.all(
        allClaims.map(async (claim) => {
          const claimHistory = await storage.getClaimStatusHistory(claim.id);
          return claimHistory;
        })
      );
      res.json(history.flat());
    } catch (error) {
      console.error("Error fetching claim history:", error);
      res.status(500).json({ message: "Error fetching claim history" });
    }
  });
  app2.patch("/api/claims/:id/status", ensureAuthenticated2, async (req, res) => {
    try {
      const { status, notes } = req.body;
      const claimId = parseInt(req.params.id);
      const allClaims = await storage.getClaims(1e3, 0);
      const currentClaim = allClaims.find((c) => c.id === claimId);
      if (!currentClaim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      const claim = await storage.updateClaimStatus(
        claimId,
        status,
        req.user?.id
      );
      if (currentClaim.status !== status && req.user?.id) {
        await storage.addClaimStatusHistory(
          claimId,
          currentClaim.status,
          status,
          req.user.id,
          notes
        );
      }
      res.json(claim);
    } catch (error) {
      console.error("Error updating claim status:", error);
      res.status(404).json({ message: "Claim not found" });
    }
  });
  app2.get("/api/reports", ensureAuthenticated2, async (req, res) => {
    try {
      const reportType = req.query.type;
      const timeframe = req.query.timeframe;
      if (!reportType || !timeframe) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      let dateThreshold;
      const now = /* @__PURE__ */ new Date();
      switch (timeframe) {
        case "30days":
          dateThreshold = new Date(now.setDate(now.getDate() - 30));
          break;
        case "6months":
          dateThreshold = new Date(now.setMonth(now.getMonth() - 6));
          break;
        case "1year":
          dateThreshold = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          dateThreshold = new Date(now.setDate(now.getDate() - 30));
      }
      if (reportType === "query") {
        const allQueries = await db.query.queries.findMany({
          where: sql2`${queries.submittedAt} >= ${dateThreshold.toISOString()}`
        });
        const open = allQueries.filter((q) => q.status === "open");
        const in_progress = allQueries.filter((q) => q.status === "in_progress");
        const resolved = allQueries.filter((q) => q.status === "resolved");
        return res.json({
          stats: {
            total: allQueries.length,
            open,
            in_progress,
            resolved
          }
        });
      } else if (reportType === "claim") {
        const allClaims = await db.query.claims.findMany({
          where: sql2`${claims.submittedAt} >= ${dateThreshold.toISOString()}`
        });
        const pending = allClaims.filter((c) => c.status === "pending");
        const approved = allClaims.filter((c) => c.status === "approved");
        const rejected = allClaims.filter((c) => c.status === "rejected");
        const paid = allClaims.filter((c) => c.status === "paid");
        return res.json({
          stats: {
            total: allClaims.length,
            pending,
            approved,
            rejected,
            paid
          }
        });
      }
      return res.status(400).json({ error: "Invalid report type" });
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });
  app2.post("/api/regulations", ensureAuthenticated2, async (req, res) => {
    try {
      const userId = req.user.id;
      let documentPaths = [];
      if (req.files && Object.keys(req.files).length > 0) {
        const files = req.files.documents ? Array.isArray(req.files.documents) ? req.files.documents : [req.files.documents] : [];
        const formData2 = JSON.parse(req.body.formData || "{}");
        let pensionerCode = formData2.pensionerCode || "unknown";
        if (formData2.pensionerId && !formData2.pensionerCode) {
          try {
            const pensioner = await storage.getPensionerById(formData2.pensionerId);
            if (pensioner) {
              pensionerCode = pensioner.code;
            }
          } catch (error) {
            console.error("Error getting pensioner details:", error);
          }
        }
        const pensionerUploadPath = createUserUploadPath(pensionerCode);
        for (const file of files) {
          const validation = validateFile(file);
          if (!validation.isValid) {
            return res.status(400).json({ message: validation.error });
          }
          const category = sanitizeFilename(formData2.category || "regulation").substring(0, 20);
          const filePrefix = `regulation_${category}`;
          const safeFileName = generateUniqueFilename(file.name, filePrefix);
          const fullUploadPath = path3.join(pensionerUploadPath, safeFileName);
          await file.mv(fullUploadPath);
          const relativePath = `/uploads/${pensionerCode}/${safeFileName}`;
          await logFileOperation(
            "FILE_UPLOAD",
            req,
            file.name,
            relativePath,
            file.size,
            true,
            {
              mimeType: file.mimetype,
              pensionerCode,
              context: "regulation_submission",
              originalName: file.name,
              newName: safeFileName,
              category: formData2.category
            }
          );
          documentPaths.push({
            path: relativePath,
            originalName: file.name,
            mimeType: file.mimetype,
            size: file.size
          });
        }
      }
      const formData = JSON.parse(req.body.formData || "{}");
      const parsedData = {
        ...formData,
        documents: documentPaths,
        pensionerId: formData.pensionerId === void 0 ? null : formData.pensionerId,
        submittedBy: userId,
        supervisorEmail: formData.supervisorEmail || null,
        email: formData.email || null
      };
      const data = insertPensionerRegulationSchema.parse(parsedData);
      const regulation = await storage.createRegulation(data);
      res.status(201).json(regulation);
    } catch (error) {
      console.error("Error creating regulation:", error);
      res.status(400).json({ message: "Invalid regulation data", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/regulations", ensureAuthenticated2, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;
      const searchTerm = req.query.search || void 0;
      console.log("Retrieving regulations with params:", { page, limit, offset, searchTerm });
      const regulations = await storage.getRegulations(limit, offset, searchTerm);
      console.log("Regulations found:", regulations.length);
      console.log("Sample regulation data:", regulations.length > 0 ? regulations[0] : "No regulations found");
      const total = await storage.getTotalRegulationsCount(searchTerm);
      const totalPages = Math.ceil(total / limit);
      console.log("Total regulations count:", total);
      res.json({
        regulations,
        total,
        currentPage: page,
        totalPages,
        itemsPerPage: limit
      });
    } catch (error) {
      console.error("Error fetching regulations:", error);
      res.status(500).json({ message: "Error fetching regulations" });
    }
  });
  app2.get("/api/regulations/history/:id", ensureAuthenticated2, async (req, res) => {
    try {
      const regulationId = parseInt(req.params.id);
      const history = await storage.getRegulationStatusHistory(regulationId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching regulation history:", error);
      res.status(500).json({ message: "Error fetching regulation history" });
    }
  });
  app2.patch("/api/regulations/:id/status", ensureAuthenticated2, async (req, res) => {
    try {
      if (req.user?.role !== "admin" && req.user?.role !== "superadmin") {
        return res.status(403).json({ message: "Forbidden: Only admins can update regulation status" });
      }
      const { status, notes } = req.body;
      if (!status || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'" });
      }
      const regulationId = parseInt(req.params.id);
      const regulation = await storage.updateRegulationStatus(
        regulationId,
        status,
        req.user.id
      );
      if (notes && req.user?.id) {
        await storage.addRegulationStatusHistory(
          regulationId,
          "pending",
          // Regulations can only be updated from pending status
          status,
          req.user.id,
          notes
        );
      }
      res.json(regulation);
    } catch (error) {
      console.error("Error updating regulation status:", error);
      res.status(404).json({ message: error instanceof Error ? error.message : "Regulation not found" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs3 from "fs";
import path5, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path4, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path4.resolve(__dirname, "client", "src"),
      "@shared": path4.resolve(__dirname, "shared")
    }
  },
  root: path4.resolve(__dirname, "client"),
  build: {
    outDir: path4.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path5.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path5.resolve(__dirname2, "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path5.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import fileUpload from "express-fileupload";
import path6 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = path6.dirname(__filename3);
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(initAuditContext);
app.use(fileUpload({
  limits: { fileSize: 2 * 1024 * 1024 },
  // 2MB limit
  abortOnLimit: true,
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: path6.join(__dirname3, "../temp")
}));
app.use("/uploads", express2.static(path6.join(__dirname3, "../uploads")));
app.use("/api", logAuditEvent);
app.use((req, res, next) => {
  const start = Date.now();
  const path7 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path7.startsWith("/api")) {
      let logLine = `${req.method} ${path7} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    const { initializeDatabase: initializeDatabase2, checkDatabaseHealth } = await Promise.resolve().then(() => (init_db(), db_exports));
    log("Initializing database connections...");
    await initializeDatabase2();
    log("Database initialized successfully");
    await auditLogger.logSystemEvent("SYSTEM_STARTUP", "Application started successfully", true, {
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    const HEALTH_CHECK_INTERVAL = 5 * 60 * 1e3;
    setInterval(async () => {
      try {
        const status = await checkDatabaseHealth();
        if (status.healthy) {
          log(`Database health check passed. Using ${status.type} database.`);
        } else {
          log(`WARNING: Database health check failed. Current database: ${status.type}`);
        }
      } catch (error) {
        log(`Error during database health check: ${error instanceof Error ? error.message : String(error)}`);
      }
    }, HEALTH_CHECK_INTERVAL);
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const port = 5e3;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    log(`Error starting server: ${error instanceof Error ? error.message : String(error)}`);
    log("Server initialization failed. Check database connections and environment variables.");
    process.exit(1);
  }
})();
