"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  benefits: string[];
  ctaText: string;
  ctaLink: string;
  className?: string;
}

export function Card({
  title,
  description,
  icon: Icon,
  benefits,
  ctaText,
  ctaLink,
  className = "",
}: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mb-4">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <ul className="space-y-2 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 text-primary-500 mr-2">•</span>
              <span className="text-gray-600 dark:text-gray-300">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
        <Link href={ctaLink}>
          <Button className="w-full">{ctaText}</Button>
        </Link>
      </div>
    </div>
  );
}
