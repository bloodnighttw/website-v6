"use client";

import { Suspense } from "react";
import load from "./loader";

export function Client(){
  if(typeof window === 'undefined')
    throw new Error("NoSSR");
  return <div onMouseEnter={()=> {
    load("/test.rsc")
  }}>Client Component</div>;
}


export default function OUO() {
  return <Suspense fallback={<div>Loading...</div>}>
    <Client />
  </Suspense>;
}