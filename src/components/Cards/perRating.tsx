import { api } from "~/utils/api";
import React from "react"
import { Card, Text, Metric, CategoryBar, Legend } from "@tremor/react";

export default function PerRating () {
    const { data, error, isLoading } = api.ratingCard.getPercent.useQuery();

    if (isLoading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>Error: {error.message}</div>;
      }
      
    return (
        <>
            <Card>
                <Text>Maintenance Accomplishment Rating</Text>
                <Metric>{data?.truePercent}%</Metric>
                <CategoryBar 
                    categoryPercentageValues={[data?.truePercent, data?.falsePercent]}
                    colors={["green", "red"]}
                    className="mt-4"
                />
                <Legend
                    categories={["Complete", "Incomplete"]}
                    colors={["green", "red"]}
                    className="mt-4"
                />
            </Card>
        </>
    )
}