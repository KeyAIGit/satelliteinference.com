"use client";
import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_TOPICS, createContactLinks } from "@/lib/contact-links.mjs";
import styles from "../app/contact/contact.module.css";

export function ContactPanel(){
  const [topic,setTopic]=useState(CONTACT_TOPICS[0]);
  const [message,setMessage]=useState("");
  const [copyStatus,setCopyStatus]=useState("");
  const links=createContactLinks(topic,message);
  async function copyAddress(){
    try{await navigator.clipboard.writeText(CONTACT_EMAIL);setCopyStatus("Email address copied.");}
    catch{setCopyStatus("Copy is unavailable. Select and copy the address shown above.");}
  }
  return <div className={styles.panel}>
    <div className={styles.emailBlock}><span>EMAIL THE TEAM</span><p className={styles.email}>{CONTACT_EMAIL}</p><button type="button" className={styles.copy} onClick={copyAddress}>{copyStatus==="Email address copied."?<Check aria-hidden="true" size={17}/>:<Copy aria-hidden="true" size={17}/>}Copy address</button><p className={styles.feedback} role="status" aria-live="polite">{copyStatus}</p></div>
    <div className={styles.composer}>
      <h2>Choose how to write.</h2><p>Open Gmail in your browser or use your preferred email app. You review and send the message in your own account.</p>
      <details className={styles.brief}><summary>Add a short brief (optional)</summary>
      <label htmlFor="inquiry-topic">What is your inquiry about?</label>
      <select id="inquiry-topic" value={topic} onChange={event=>setTopic(event.target.value)}>{CONTACT_TOPICS.map(item=><option key={item}>{item}</option>)}</select>
      <label htmlFor="inquiry-message">Your message <span>(optional)</span></label>
      <textarea id="inquiry-message" rows={5} value={message} maxLength={1200} onChange={event=>setMessage(event.target.value)} placeholder="Tell us about your organization, workload or interest." aria-describedby="message-privacy"/>
      <p className={styles.privacy} id="message-privacy">Nothing is submitted here. Your text stays in this page until you choose an email service.</p>
      </details>
      <div className={styles.actions}><a className={styles.gmail} href={links.gmail} target="_blank" rel="noopener noreferrer"><Mail size={18} aria-hidden="true"/>Open Gmail draft<ArrowUpRight size={16} aria-hidden="true"/></a><a className={styles.other} href={links.mailto}>Use another email app<ArrowUpRight size={16} aria-hidden="true"/></a></div>
      <p className={styles.hint}>Gmail opens in a new tab and may ask you to sign in. Other email apps use your device’s default setting.</p>
    </div>
  </div>;
}
