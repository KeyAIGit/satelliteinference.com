export const CONTACT_EMAIL: string;
export const CONTACT_TOPICS: string[];
export function createContactLinks(topic?:string,message?:string):{gmail:string;mailto:string;subject:string;body:string};
