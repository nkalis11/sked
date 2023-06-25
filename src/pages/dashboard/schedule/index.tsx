import { type NextPage } from "next";
import WeeklyMaintenance from '~/components/Tables/WeeklyMaintenance'
import { Card, Grid } from '@tremor/react'
import DashboardLayout from '~/components/Layouts/DashboardLayout'

const Schedule: NextPage = () => {
    return (
        <DashboardLayout>
            <Grid className="h-full">
                <Card className="h-1/2">
                <WeeklyMaintenance />
                </Card>
            </Grid>
        </DashboardLayout>
    )
}
export default Schedule;