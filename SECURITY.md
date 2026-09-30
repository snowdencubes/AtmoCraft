# Security Policy

## Supported Versions

Currently, Capacity Connect is heavily under development for the Smart India Hackathon 2026. Only the `main` branch is receiving updates. 

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Reporting a Vulnerability

If you discover any security-related issues, please **do not** report them via public GitHub issues. Instead, report the vulnerability privately by emailing [krishkumarcodes@gmail.com].

You should receive a response within 48 hours. If the issue is confirmed as a vulnerability, we will create a patch and release it as quickly as possible.

## ⚠️ Important Note Regarding Demo State

Please note that the current version (`0.1.0`) is built primarily as a high-fidelity prototype utilizing a **demo-only authentication layer** and an **in-memory demo database** (via Zustand `persist`). 
- Passwords are hashed using the Web Crypto API, but the local nature of the app means this is not production-ready security. 
- A full migration to a live **Supabase** backend with Row Level Security (RLS) is currently in progress. 
- Please refrain from entering real sensitive data into the demo portal.
