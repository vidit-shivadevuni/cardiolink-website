#!/usr/bin/env node
// Manage invite-only demo logins in dev-data/demo-accounts.json.
//
//   npm run demo-account -- add jane@clinic.org "Dr. Jane Smith"   (prints a generated password once)
//   npm run demo-account -- list
//   npm run demo-account -- remove jane@clinic.org
//
// Hashing must stay in sync with hashPassword() in lib/auth.ts (scrypt, 64-byte key, hex salt).
import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "dev-data", "demo-accounts.json");
const load = () => (existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : []);
const save = (accounts) => {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(accounts, null, 2)}\n`, { mode: 0o600 });
};

const [command, email, name] = process.argv.slice(2);
const accounts = load();
const index = email ? accounts.findIndex((a) => a.email.toLowerCase() === email.toLowerCase()) : -1;

if (command === "add" && email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("That doesn't look like an email address.");
    process.exit(1);
  }
  // Readable but strong: 4 groups of 4 characters, without look-alikes (0/O, 1/l/I).
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const password = Array.from(randomBytes(16), (b, i) => (i && i % 4 === 0 ? "-" : "") + alphabet[b % alphabet.length]).join("");
  const salt = randomBytes(16).toString("hex");
  const account = {
    email,
    name: name || email,
    salt,
    passwordHash: scryptSync(password, salt, 64).toString("hex"),
    createdAt: new Date().toISOString(),
  };
  if (index >= 0) accounts[index] = account;
  else accounts.push(account);
  save(accounts);
  console.log(`${index >= 0 ? "Reset" : "Created"} demo login for ${email}`);
  console.log(`Password: ${password}`);
  console.log("Share it privately; it isn't stored anywhere in plain text.");
} else if (command === "remove" && email) {
  if (index < 0) {
    console.error(`No account for ${email}.`);
    process.exit(1);
  }
  accounts.splice(index, 1);
  save(accounts);
  console.log(`Removed ${email}.`);
} else if (command === "list") {
  if (accounts.length === 0) console.log("No demo accounts yet.");
  for (const a of accounts) console.log(`${a.email}\t${a.name}\tcreated ${a.createdAt}`);
} else {
  console.log('Usage: npm run demo-account -- add <email> "<name>" | list | remove <email>');
  process.exit(command ? 1 : 0);
}
