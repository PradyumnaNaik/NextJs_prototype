# Security & Authentication Rules

> **MISSION CRITICAL** | Security violations = immediate escalation | ~600 tokens

---

## §1 SERVER BOUNDARY SECURITY (BLOCKING)

### RULE 1.1: Secrets ONLY in Server Components
```typescript
// ✅ CORRECT: Server-only secrets
// src/lib/db.ts
import 'server-only'; // Enforces server-only import

const db = new PrismaClient();
export { db };

// ✅ CORRECT: API keys in Server Component
export default async function Page() {
  const data = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.API_SECRET}` }
  });
}

// ❌ VIOLATION: Secrets in Client Component
'use client';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Exposed to browser!
```

### RULE 1.2: Sensitive Logic in Server Actions
```typescript
// ✅ CORRECT: Auth check in Server Action
'use server';
import { auth } from '@/lib/auth';

export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  if (session.user.role !== 'admin') throw new Error('Forbidden');
  
  await db.user.delete({ where: { id: userId } });
}

// ❌ VIOLATION: Auth check in Client Component only
'use client';
export function DeleteButton() {
  if (!user.isAdmin) return null; // NOT SECURE - client-side only
  return <button onClick={...}>Delete</button>;
}
```

---

## §2 INPUT VALIDATION (BLOCKING)

### RULE 2.1: Zod Validation in Server Actions
```typescript
// ✅ CORRECT: Schema validation REQUIRED
'use server';
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8),
});

export async function createUser(formData: FormData) {
  const parsed = CreateUserSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
    password: formData.get('password'),
  });
  
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  
  // Safe to use parsed.data
}

// ❌ VIOLATION: No validation
export async function createUser(formData: FormData) {
  const email = formData.get('email'); // Unvalidated!
  await db.user.create({ data: { email } });
}
```

### RULE 2.2: URL Validation
```typescript
// ✅ CORRECT: Validate URLs before use
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// ❌ VIOLATION: Unvalidated URL redirect
redirect(userProvidedUrl); // Open redirect vulnerability
```

---

## §3 AUTHENTICATION PATTERNS (BLOCKING)

### RULE 3.1: Middleware for Route Protection
```typescript
// ✅ CORRECT: middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

### RULE 3.2: Server-Side Session Validation
```typescript
// ✅ CORRECT: Validate session in Server Component
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  return <Dashboard user={session.user} />;
}

// ❌ VIOLATION: Client-only auth check
'use client';
export default function DashboardPage() {
  const { user, loading } = useAuth();
  if (!user) redirect('/login'); // Race condition, not secure
}
```

---

## §4 XSS PREVENTION (BLOCKING)

### RULE 4.1: Never Use dangerouslySetInnerHTML with User Data
```typescript
// ✅ CORRECT: React auto-escapes
<div>{userContent}</div>

// ✅ CORRECT: Sanitize if HTML required
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />

// ❌ VIOLATION: Unsanitized HTML
<div dangerouslySetInnerHTML={{ __html: userProvidedHtml }} />
```

### RULE 4.2: External Links Security
```typescript
// ✅ CORRECT: rel attributes for external links
<a href={externalUrl} target="_blank" rel="noopener noreferrer">
  External Link
</a>

// ❌ VIOLATION: Missing rel
<a href={externalUrl} target="_blank">Link</a>
```

---

## §5 DATA EXPOSURE (BLOCKING)

### RULE 5.1: Never Log Sensitive Data
```typescript
// ❌ VIOLATION: Logging sensitive data
console.log('User:', user.password);
console.log('Token:', authToken);
console.log('Request:', JSON.stringify(request.body)); // May contain PII

// ✅ CORRECT: Redacted logging
console.log('User ID:', user.id);
console.log('Auth status:', !!authToken);
```

### RULE 5.2: Strip Sensitive Fields Before Client
```typescript
// ✅ CORRECT: DTO pattern
function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    // Exclude: password, internalId, apiKey
  };
}

// In Server Component
const user = await db.user.findUnique({ where: { id } });
return <UserProfile user={toUserDTO(user)} />; // Safe to pass to client
```

---

## SECURITY VIOLATIONS = INCIDENT

| Rule | Violation | Severity |
|------|-----------|----------|
| 1.1 | Secrets in client code | **CRITICAL** |
| 1.2 | Auth logic client-only | **CRITICAL** |
| 2.1 | Missing input validation | **HIGH** |
| 2.2 | Unvalidated URL redirect | **HIGH** |
| 3.2 | Missing server auth check | **CRITICAL** |
| 4.1 | Unsanitized HTML | **CRITICAL** |
| 5.1 | Logging credentials | **HIGH** |
