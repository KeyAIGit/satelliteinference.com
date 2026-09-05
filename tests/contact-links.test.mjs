import assert from 'node:assert/strict';
import test from 'node:test';
import { CONTACT_EMAIL, createContactLinks } from '../lib/contact-links.mjs';
test('Gmail composition preserves the recipient and Unicode message without injecting query parameters',()=>{
 const body='Привет & to=someone@example.com\nA question? #details + 25%';
 const result=createContactLinks('Investor inquiry',body);const url=new URL(result.gmail);
 assert.equal(url.origin,'https://mail.google.com');assert.equal(url.searchParams.get('to'),CONTACT_EMAIL);
 assert.equal(url.searchParams.getAll('to').length,1);assert.equal(url.searchParams.get('body'),body);
 assert.equal(url.searchParams.get('su'),'Satellite Inference: Investor inquiry');assert.equal(url.searchParams.get('view'),'cm');
});
test('Email-app alternative encodes line breaks and keeps a single fixed recipient',()=>{
 const result=createContactLinks('General inquiry','Hello\r\n&bcc=other@example.com');
 assert.ok(result.mailto.startsWith(`mailto:${CONTACT_EMAIL}?`));
 const params=new URLSearchParams(result.mailto.split('?')[1]);assert.equal(params.get('bcc'),null);assert.equal(params.get('body'),'Hello\r\n&bcc=other@example.com');
});
test('Draft length is bounded and unknown topics cannot alter the subject',()=>{
 const result=createContactLinks('x\r\nbcc:other@example.com','x'.repeat(1500));
 assert.equal(result.body.length,1200);assert.equal(result.subject,'Satellite Inference: General inquiry');
});
