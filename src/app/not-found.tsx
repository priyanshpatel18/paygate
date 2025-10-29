"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 },
};

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Page Not Found - AnchorLabs";
  }, []);

  return (
    <motion.div
      className={cn(
        "min-h-[calc(100vh-60px)] bg-background py-16 px-6 sm:px-8 lg:px-12 flex flex-col items-center justify-center text-center",
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } }}
      >
        <h1 className={cn("text-4xl font-bold text-primary tracking-tight mb-4")}>
          404 - Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          The page you are looking for does not exist.
        </p>
        <Button onClick={() => router.back()} className="mr-2 cursor-pointer text-lg py-6">
          Go Back
        </Button>
        <Button onClick={() => router.push("/")} variant="outline" className="cursor-pointer text-lg py-6">
          Go to Homepage
        </Button>
      </motion.div>
    </motion.div>
  );
}