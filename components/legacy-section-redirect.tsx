"use client";
import { useEffect } from "react";
const destinations:Record<string,string>={
  "#concept":"/mission#concept", "#model":"/mission#model", "#roadmap":"/mission#roadmap",
  "#architecture":"/mission#architecture", "#evidence":"/progress", "#documents":"/publications", "#contact":"/contact", "#why":"/#approach",
};
export function LegacySectionRedirect(){
  useEffect(()=>{
    const redirect=()=>{const destination=destinations[window.location.hash];if(destination)window.location.replace(destination);};
    redirect();window.addEventListener("hashchange",redirect);return()=>window.removeEventListener("hashchange",redirect);
  },[]);
  return null;
}
