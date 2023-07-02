import { type NextPage } from "next";
import WeeklyMaintenance from '~/components/Tables/WeeklyMaintenance'
import { Col, Card, Grid } from '@tremor/react'
import DashboardLayout from '~/components/Layouts/DashboardLayout'

const Schedule: NextPage = () => {
    return (
        <DashboardLayout>
            <div className="min-h-full">
                <Col className="my-4">
                    <Card>
                        <div className="h-full">
                            <WeeklyMaintenance />
                        </div>
                    </Card>
                </Col>
            </div>
        </DashboardLayout>
    )
}
export default Schedule;