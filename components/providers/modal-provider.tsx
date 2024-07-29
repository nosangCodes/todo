"use client";
import React, { useEffect, useState } from "react";
import AddTaskModal from "../modals/add-task";
import AddProjectModal from "../modals/add-project";
type Props = {};

export default function ModalProvider({}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
      <AddTaskModal />
      <AddProjectModal />
    </>
  );
}
