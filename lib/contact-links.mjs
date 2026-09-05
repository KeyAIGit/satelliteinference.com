export const CONTACT_EMAIL = "procurement@satelliteinference.com";
export const CONTACT_TOPICS = ["General inquiry", "Mission data and benchmarks", "Spacecraft and technology partnership", "Investor inquiry"];
export function createContactLinks(topic = CONTACT_TOPICS[0], message = "") {
  const chosenTopic = CONTACT_TOPICS.includes(topic) ? topic : CONTACT_TOPICS[0];
  const subject = `Satellite Inference: ${chosenTopic}`;
  const cleanMessage = String(message).trim().slice(0, 1200);
  const body = cleanMessage || "Hello Satellite Inference,\n\nI would like to learn more about your program. Please reply by email.";
  const gmail = new URL("https://mail.google.com/mail/");
  gmail.search = new URLSearchParams({view:"cm",fs:"1",to:CONTACT_EMAIL,su:subject,body}).toString();
  const mailto = `mailto:${CONTACT_EMAIL}?${new URLSearchParams({subject,body}).toString().replaceAll('+','%20')}`;
  return {gmail:gmail.toString(),mailto,subject,body};
}
