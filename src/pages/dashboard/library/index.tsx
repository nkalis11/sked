import type { NextPage } from "next";
import { Grid, Card, Col } from "@tremor/react"
import DashboardLayout from "~/components/Layouts/DashboardLayout";
import FullMaintenance from "~/components/Tables/FullMaintenance";

const Library: NextPage = () => {
    return ( 
        <DashboardLayout>
            <div className="min-h-full">
                <Col className="my-4">
                    <Card>
                        <div className="h-full">
                            <FullMaintenance />
                        </div>
                    </Card>
                </Col>
            </div>
        </DashboardLayout>

    )
}
export default Library;