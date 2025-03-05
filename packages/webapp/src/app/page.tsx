"use client";

import { OwnerCard } from "@/components/landing/owner-card";
import { MemberCard } from "@/components/landing/member-card";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Superfluid Pools Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create and manage Superfluid Pools to distribute rewards to your
            community, or collect units from existing pools to earn rewards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <OwnerCard />
          <MemberCard />
        </div>
      </main>
    </div>
  );
}
