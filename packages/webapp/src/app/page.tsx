"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Droplets } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Droplets className="h-16 w-16 text-accent" />
            </div>
            <CardTitle className="text-4xl font-bold text-accent">
              Welcome to DemoGDA
            </CardTitle>
            <p className="mt-4 text-xl text-muted-foreground">
              A web3 platform for creating and managing Superfluid Pools
            </p>
          </CardHeader>
          <CardContent>
            <div className="max-w-3xl mx-auto">
              <p className="mb-6 text-center">
                DemoGDA enables community owners to create Superfluid Pools and
                distribute rewards to their community members. Community members
                can collect units from these pools and claim rewards.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      For Community Owners
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 mb-6">
                      <li>Create Superfluid Pools</li>
                      <li>Fund pools with one-off payments</li>
                      <li>Set up streaming distributions</li>
                      <li>Monitor pool activity</li>
                    </ul>
                    <Link href="/pools">
                      <Button className="w-full">Manage Pools</Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      For Community Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 mb-6">
                      <li>Browse available pools</li>
                      <li>Collect units from pools</li>
                      <li>Claim rewards</li>
                      <li>Track your earnings</li>
                    </ul>
                    <Link href="/">
                      <Button className="w-full" variant="outline">
                        Browse Pools
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mt-10">
                <Link href="/pools">
                  <Button size="lg" className="px-8">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
