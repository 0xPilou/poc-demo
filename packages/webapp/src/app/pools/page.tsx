"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreatePoolForm } from "@/components/pools/CreatePoolForm";
import { FundPoolForm } from "@/components/pools/FundPoolForm";

export default function PoolsPage() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Manage Pools
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Create and fund Superfluid Pools to distribute rewards to your
          community.
        </p>

        <Tabs defaultValue="create" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="create">Create Pool</TabsTrigger>
            <TabsTrigger value="fund">Fund Pool</TabsTrigger>
            <TabsTrigger value="manage">My Pools</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Pool</CardTitle>
                <CardDescription>
                  Set up a new Superfluid Pool to distribute rewards to your
                  community.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreatePoolForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fund">
            <Card>
              <CardHeader>
                <CardTitle>Fund an Existing Pool</CardTitle>
                <CardDescription>
                  Add funds to your existing Superfluid Pools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FundPoolForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>My Pools</CardTitle>
                <CardDescription>
                  Manage your existing Superfluid Pools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* PoolList component will be implemented later */}
                <p className="text-gray-600 dark:text-gray-300">
                  Pool management features will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
