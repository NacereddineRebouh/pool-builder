"use client"
import Scene, { MemoisedScene } from "@/components/3D/Scene";
import SideBar from "@/components/UI/SideBar";
import RightSideBar from "@/components/UI/Right Sidebar/SideBar2";
import React,{ useState } from "react";

interface helperObjectType {
  dragging:boolean,
  type:string,
}

export default function Home() {
  
  return (
    <div className="h-screen w-screen bg-sky-200">
      {/* 3d Builder */}
      {/* <Scene HelperObject={helperObject}/> */}
      {/* <MemoisedScene/> */}

      {/* Left-Side Bars */}
      <SideBar />
      {/* Right-Side Bars */}
      <RightSideBar />
    </div>
  );
}
