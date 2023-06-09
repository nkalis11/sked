import { api } from "~/utils/api";
import React from "react"

export default function NewTest() {

    const { data, error, isLoading } = api.maintenanceCard.getMaintByCurrentUser.useQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {data.map((card) => (
                <div key={card.card.id}>
                    <h2>{card.card.Title}</h2>
                    <p>{card.card.Description}</p>
                </div>
            ))}
        </div>
    )
}