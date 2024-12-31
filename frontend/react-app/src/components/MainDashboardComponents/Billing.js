import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";
import { Card, CardContent } from "../ui/card";

export default function Billing() {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [progress, setProgress] = useState(65); 

    const plans = [
        {
            name: "Basic",
            price: { monthly: 29, annual: 290 },
            description: "Perfect for small teams and startups",
            features: [
                "Up to 5 team members",
                "10GB storage space",
                "Basic analytics dashboard",
                "Email support",
                "API access",
                "Basic integrations"
            ],
            isPopular: false
        },
        {
            name: "Professional",
            price: { monthly: 59, annual: 590 },
            description: "Ideal for growing businesses",
            features: [
                "Up to 20 team members",
                "50GB storage space",
                "Advanced analytics",
                "24/7 priority support",
                "Advanced API access",
                "Custom integrations"
            ],
            isPopular: false
        },
        {
            name: "Enterprise",
            price: { monthly: 99, annual: 990 },
            description: "For large scale organizations",
            features: [
                "Unlimited team members",
                "Unlimited storage",
                "Custom analytics",
                "Dedicated support",
                "Full API access",
                "Enterprise integrations"
            ],
            isPopular: true
        }
    ];

    return (
        <ScrollArea className="h-full">
            <div className="p-8 space-y-8">
                {/* Current Plan Status */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-4">Current Plan Status</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">Plan Validity</span>
                                    <span className="text-sm text-gray-500">65% Complete</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                            <p className="text-sm text-gray-600">Your Enterprise plan will expire in 127 days</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Latest Invoice */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-4">Latest Invoice</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Invoice Number</span>
                                <span className="font-medium">INV-2024-001</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Date</span>
                                <span className="font-medium">Dec 31, 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount</span>
                                <span className="font-medium">$990.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status</span>
                                <span className="text-green-500 font-medium">Paid</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Plans Section */}
                <div className="w-full max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Available Plans
                        </h2>
                        <div className="mt-6 inline-flex items-center p-1 bg-gray-100 rounded-lg">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    billingCycle === 'monthly' 
                                    ? 'bg-white shadow-sm text-gray-900' 
                                    : 'text-gray-600'
                                }`}
                            >
                                Monthly billing
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    billingCycle === 'annual' 
                                    ? 'bg-white shadow-sm text-gray-900' 
                                    : 'text-gray-600'
                                }`}
                            >
                                Annual billing
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, idx) => (
                            <div 
                                key={plan.name}
                                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                                    plan.isPopular 
                                    ? 'border-2 border-blue-500 shadow-lg scale-105 z-10' 
                                    : 'border border-gray-200 opacity-50 hover:opacity-100'
                                }`}
                            >
                                {plan.isPopular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                                        Recommended
                                    </span>
                                )}
                                
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">
                                        ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.annual}
                                    </span>
                                    <span className="text-gray-600">
                                        /{billingCycle === 'monthly' ? 'mo' : 'year'}
                                    </span>
                                </div>

                                <button className={`w-full py-3 px-4 rounded-lg mb-6 font-medium transition-colors ${
                                    plan.isPopular
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                }`}>
                                    Get started
                                </button>

                                <div className="space-y-4">
                                    {plan.features.map((feature, featureIdx) => (
                                        <div key={featureIdx} className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-blue-500" />
                                            <span className="text-gray-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}