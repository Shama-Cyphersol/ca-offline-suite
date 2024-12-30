import React from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function Billing() {
    return (
        <ScrollArea className="h-full">
            <div className="p-8 space-y-8">
                <div className="text-left">
                    <h2 className="text-3xl font-extrabold to-blue-400 bg-clip-text ">
                        Billing
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Discover the products you're eligible for and the associated
                        benefits.
                    </p>
                </div>
            </div>
        </ScrollArea>
    );
}
