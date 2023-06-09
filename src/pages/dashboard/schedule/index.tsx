import { type NextPage } from "next";
import WeeklyMaintenance from '~/components/Tables/WeeklyMaintenance'
import { Grid } from '@tremor/react'
import DashboardLayout from '~/components/Layouts/DashboardLayout'

const Schedule: NextPage = () => {
    return (
        <DashboardLayout>
            <Grid>
                <WeeklyMaintenance />
            </Grid>
        </DashboardLayout>
    )
}
export default Schedule;