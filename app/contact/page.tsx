import type { Metadata } from "next";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { ContactPanel } from "@/components/contact-panel";
import styles from "../content.module.css";
export const metadata:Metadata={title:"Contact",description:"Contact Satellite Inference by email about mission data, technology partnerships or investment. No call required.",alternates:{canonical:"/contact"}};
export default function ContactPage(){return <main className={styles.page}>
<a className="skip-link" href="#contact-content">Skip to contact options</a><SiteNavigation/>
<header className={styles.intro}><p className={styles.eyebrow}>CONTACT SATELLITE INFERENCE</p><h1>Start a conversation.<br />By email.</h1><p>For mission-data teams, technology partners and investors. Tell us what you are working on and what you would like to explore. No call or meeting is required.</p></header>
<section className={styles.section} id="contact-content" tabIndex={-1}><ContactPanel/></section><SiteFooter/>
</main>;}
