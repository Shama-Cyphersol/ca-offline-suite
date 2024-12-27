// src/components/StatCard.js
import React from 'react';
import { Card, CardContent } from "../ui/card";

const StatCard = ({ title, value }) => (
  <Card className="bg-white shadow-lg">
    <CardContent className="p-6">
      <p className="text-5xl font-bold text-[#3498db] text-center">{value}</p>
      <p className="text-gray-600 mt-4 text-center text-lg">{title}</p>
    </CardContent>
  </Card>
);

export default StatCard;
