import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import net from 'node:net';
import { validateCustomInput, validateSample, canTransition, MAX_SAMPLE_SIZE } from '../lib/custom-agreement.ts';
const require = createRequire(import.meta.url), ts = require('typescript');
const details = { agreementType: 'Service agreement', purpose: 'An agreement for consulting services', language: 'English', instructions: 'Replace the service scope and update both parties.', preferredDate: '', name: 'Example Customer', phone: '9876543210', email: '', contactMethod: 'Call', contactConsent: true };
const id = 'CUSTOM_00000000-0000-4000-8000-000000000001';
type Data = Record<string, any>;
function harness(seed: Data = {}, extras: Data = {}) {
  let documents = structuredClone(seed), queue = Promise.resolve();
  const snapshot = (path: string, source = documents) => ({ exists: path in source, id: path.split('/').at(-1), data: () => structuredClone(source[path]) });
  const db = {
    collection: (name: string) => {
      let key = '', value: unknown, count = 100;
      const query = {
        doc: (id: string) => ({ path: `${name}/${id}`, get: async () => snapshot(`${name}/${id}`) }),
        where: (k: string, _op: string, v: unknown) => { key = k; value = v; return query; },
        orderBy: () => query, limit: (n: number) => { count = n; return query; },
        get: async () => ({ docs: Object.keys(documents).filter((p) => p.startsWith(`${name}/`) && (!key || documents[p][key] === value)).slice(0, count).map((p) => snapshot(p)) }),
      }; return query;
    },
    runTransaction: (callback: (tx: Data) => Promise<unknown>) => {
      const result = queue.then(async () => {
        const draft = structuredClone(documents); let writing = false;
        const tx = {
          get: async (ref: Data) => { assert.equal(writing, false, 'No reads after writes'); return snapshot(ref.path, draft); },
          set: (ref: Data, data: Data) => { writing = true; draft[ref.path] = structuredClone(data); },
          create: (ref: Data, data: Data) => { writing = true; assert.ok(!(ref.path in draft)); draft[ref.path] = structuredClone(data); },
          update: (ref: Data, data: Data) => { writing = true; draft[ref.path] = { ...draft[ref.path], ...structuredClone(data) }; },
        };
        const result = await callback(tx); documents = draft; return result;
      }); queue = result.then(() => undefined, () => undefined); return result;
    },
  };
  let scans = 0, downloads = 0;
  const bytes = Buffer.from('%PDF-example');
  const bucket = { file: () => ({ getMetadata: async () => [{ size: bytes.length, contentType: 'application/pdf', generation: '1' }], setMetadata: async () => {}, download: async () => { downloads++; return [bytes]; }, getSignedUrl: async () => ['https://storage.example/private-sample'] }) };
  const cache: Data = {};
  function load(name: string): any {
    if (name in extras) return extras[name];
    if (name === 'next/server') return { NextResponse: { json: (data: unknown, options?: ResponseInit) => new Response(JSON.stringify(data), options) } };
    if (name === '@/lib/firebase-admin') return { getAdminDb: () => db, getAdminBucket: () => bucket, verifyFirebaseIdToken: async (token: string) => { if (token === 'bad') throw Object.assign(new Error('Invalid'), { code: 'auth/invalid-id-token' }); return { uid: token, email: token === 'admin' ? 'pradhiip92@gmail.com' : 'user@example.com', email_verified: true }; } };
    if (name === '@/lib/sample-scanner') return { validateSampleBytes: () => {}, scanSample: async () => { scans++; } };
    if (!name.startsWith('@/')) return require(name);
    if (cache[name]) return cache[name];
    const source = readFileSync(new URL(`../${name.slice(2)}.ts`, import.meta.url), 'utf8');
    const target = { exports: {} };
    runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText, { module: target, exports: target.exports, require: load, Date, Buffer, console, setTimeout, clearTimeout, process: extras.process ?? { env: {} } });
    return cache[name] = target.exports;
  }
  return { load, read: (path: string) => documents[path], scans: () => scans, downloads: () => downloads };
}
function request(method = 'POST', body?: unknown, token = 'customer', url = 'https://example.test/api/custom-agreements') {
  return Object.assign(new Request(url, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) }), { nextUrl: new URL(url) });
}
const draft = { ...details, requestId: id, ownerUid: 'customer', status: 'Uploading', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), files: { 'sample-1': { id: 'sample-1', name: 'sample.pdf', size: 12, contentType: 'application/pdf', path: `custom-agreements/customer/${id}/sample-1` } } };
test('custom request validation enforces contact consent, contact bounds, dates and sample limits', () => {
  assert.equal(validateCustomInput(details).contactConsent, true);
  for (const changes of [{ contactConsent: false }, { phone: '1234567890' }, { contactMethod: 'Email' }, { preferredDate: '2026-02-30' }, { instructions: 'short' }, { purpose: 'x'.repeat(1001) }]) assert.throws(() => validateCustomInput({ ...details, ...changes }));
  assert.equal(validateSample({ name: 'photo.JPG', size: MAX_SAMPLE_SIZE, contentType: 'image/jpeg' }).size, MAX_SAMPLE_SIZE);
  for (const sample of [{ name: 'sample.exe', size: 1, contentType: 'application/pdf' }, { name: '../sample.pdf', size: 1, contentType: 'application/pdf' }, { name: 'sample.pdf', size: MAX_SAMPLE_SIZE + 1, contentType: 'application/pdf' }, { name: 'sample.pdf', size: 2, contentType: 'image/png' }]) assert.throws(() => validateSample(sample));
  assert.equal(canTransition('Submitted', 'Completed'), false);
  assert.equal(canTransition('Quote Sent', 'Accepted'), true);
  assert.equal(canTransition('Completed', 'Under Review'), false);
});
test('request creation is idempotent, server-controlled, and rate-limited across concurrent submissions', async () => {
  const h = harness(), route = h.load('@/app/api/custom-agreements/route');
  const body = { action: 'create', requestId: id, details, files: [{ name: 'sample.pdf', size: 12, contentType: 'application/pdf' }], status: 'Completed', quoteAmount: 1 };
  assert.equal((await route.POST(request('POST', body))).status, 200);
  assert.equal(h.read(`customAgreementRequests/${id}`).status, 'Uploading');
  assert.equal(h.read(`customAgreementRequests/${id}`).quoteAmount, undefined);
  assert.equal((await route.POST(request('POST', body))).status, 200);
  assert.equal((await route.POST(request('POST', body, 'other'))).status, 409);
  const results = await Promise.all(Array.from({ length: 6 }, (_, i) => route.POST(request('POST', { ...body, requestId: `CUSTOM_00000000-0000-4000-8000-${String(i + 2).padStart(12, '0')}` }))));
  assert.equal(results.filter((r) => r.status === 200).length, 4);
  assert.equal(results.filter((r) => r.status === 429).length, 2);
});
test('finalization scans before submission and blocks foreign ownership; repeated finalization does not rescan', async () => {
  const h = harness({ [`customAgreementRequests/${id}`]: draft }), route = h.load('@/app/api/custom-agreements/route');
  assert.equal((await route.POST(request('POST', { action: 'finalize', requestId: id }, 'other'))).status, 404);
  assert.equal(h.scans(), 0);
  assert.equal((await route.POST(request('POST', { action: 'finalize', requestId: id }))).status, 200);
  assert.equal(h.read(`customAgreementRequests/${id}`).status, 'Submitted');
  assert.equal(h.read(`customAgreementRequests/${id}`).scanStatus, 'Clean');
  assert.equal((await route.POST(request('POST', { action: 'finalize', requestId: id }))).status, 200);
  assert.equal(h.scans(), 1);
});
test('scanner failure keeps samples unreviewable and clears the scan lease for retries', async () => {
  const h = harness({ [`customAgreementRequests/${id}`]: draft }, { '@/lib/sample-scanner': { validateSampleBytes: () => {}, scanSample: async () => { throw new Error('Scanner offline'); } } });
  assert.equal((await h.load('@/app/api/custom-agreements/route').POST(request('POST', { action: 'finalize', requestId: id }))).status, 500);
  assert.equal(h.read(`customAgreementRequests/${id}`).status, 'Uploading');
  assert.equal(h.read(`customAgreementRequests/${id}`).scanLeaseUntil, 0);
  assert.equal((await h.load('@/app/api/custom-agreements/sample/route').GET(request('GET', undefined, 'customer', `https://example.test/api/custom-agreements/sample?requestId=${id}&sampleId=sample-1`))).status, 409);
});
test('customer views hide internal fields, download access is scoped and admin scope is protected', async () => {
  const h = harness({ [`customAgreementRequests/${id}`]: { ...draft, status: 'Submitted', scanStatus: 'Clean', internalNotes: 'Secret', assignedTo: 'Staff' } });
  const route = h.load('@/app/api/custom-agreements/route');
  const response = await route.GET(request('GET')); const result = await response.json();
  assert.equal(result.requests[0].internalNotes, undefined); assert.equal(result.requests[0].assignedTo, undefined);
  assert.equal((await route.GET(request('GET', undefined, 'customer', 'https://example.test/api/custom-agreements?scope=admin'))).status, 403);
  assert.equal((await route.GET(request('GET', undefined, 'bad'))).status, 401);
  assert.equal((await route.GET(request('GET', undefined, 'other'))).status, 200);
  const samples = h.load('@/app/api/custom-agreements/sample/route');
  const url = `https://example.test/api/custom-agreements/sample?requestId=${id}&sampleId=sample-1`;
  assert.equal((await samples.GET(request('GET', undefined, 'other', url))).status, 404);
  assert.equal((await samples.GET(request('GET', undefined, 'customer', url))).status, 200);
});
test('review transitions, manual acceptance, quote locks and persisted customer clarifications are enforced', async () => {
  const h = harness({ [`customAgreementRequests/${id}`]: { ...draft, status: 'Under Review', scanStatus: 'Clean' } }), route = h.load('@/app/api/custom-agreements/route');
  const patch = (body: Data, token = 'admin') => route.PATCH(request('PATCH', { requestId: id, ...body }, token));
  assert.equal((await patch({ status: 'Completed' })).status, 409);
  assert.equal((await patch({ status: 'Quote Sent' })).status, 400);
  assert.equal((await patch({ status: 'Quote Sent', quoteAmount: 500 })).status, 200);
  assert.equal((await patch({ status: 'Accepted' })).status, 400);
  assert.equal((await patch({ status: 'Accepted', acceptanceConfirmed: true })).status, 200);
  assert.equal((await patch({ status: 'In Progress', quoteAmount: 900 })).status, 409);
  assert.equal((await patch({ status: 'In Progress' })).status, 200);
  assert.equal((await patch({ status: 'Completed' }, 'customer')).status, 409);
  const h2 = harness({ [`customAgreementRequests/${id}`]: { ...draft, status: 'Clarification Required' } });
  const answer = { requestId: id, action: 'reply', customerReply: 'Please use the updated service description.' };
  assert.equal((await h2.load('@/app/api/custom-agreements/route').PATCH(request('PATCH', answer))).status, 200);
  assert.equal(h2.read(`customAgreementRequests/${id}`).customerReply, answer.customerReply);
  assert.equal(h2.read(`customAgreementRequests/${id}`).status, 'Under Review');
});
test('sample signature checks reject disguised files and malformed DOCX without unsafe extraction', () => {
  const scanner = harness({}, { '@/lib/sample-scanner': undefined });
  // Load the real scanner rather than the API test stub.
  const source = readFileSync(new URL('../lib/sample-scanner.ts', import.meta.url), 'utf8'), target = { exports: {} as any };
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText, { module: target, exports: target.exports, require: (name: string) => name.startsWith('@/') ? scanner.load(name) : require(name), Buffer, setTimeout, clearTimeout, process: { env: {} } });
  target.exports.validateSampleBytes(Buffer.from('%PDF-example'), 'application/pdf');
  for (const type of ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']) assert.throws(() => target.exports.validateSampleBytes(Buffer.from('x'), type));
});
test('ClamAV stream protocol accepts only clean results and fails closed when unconfigured or infected', async () => {
  let verdict = 'stream: OK\0';
  const server = net.createServer((socket) => {
    let received = Buffer.alloc(0), replied = false;
    socket.on('data', (chunk) => {
      received = Buffer.concat([received, chunk]);
      if (!replied && received.length > 14 && received.subarray(-4).equals(Buffer.alloc(4))) { replied = true; socket.end(verdict); }
    });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const port = (server.address() as net.AddressInfo).port, env: Data = { CLAMAV_HOST: '127.0.0.1', CLAMAV_PORT: String(port) };
    const source = readFileSync(new URL('../lib/sample-scanner.ts', import.meta.url), 'utf8'), target = { exports: {} as any }, h = harness();
    runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText, { module: target, exports: target.exports, require: (name: string) => name.startsWith('@/') ? h.load(name) : require(name), Buffer, setTimeout, clearTimeout, process: { env } });
    await target.exports.scanSample(Buffer.from('example'));
    verdict = 'stream: Eicar-Signature FOUND\0'; await assert.rejects(target.exports.scanSample(Buffer.from('example')), (err: Data) => err.status === 400);
    delete env.CLAMAV_HOST; await assert.rejects(target.exports.scanSample(Buffer.from('example')), (err: Data) => err.status === 503);
  } finally { await new Promise<void>((resolve) => server.close(() => resolve())); }
});
