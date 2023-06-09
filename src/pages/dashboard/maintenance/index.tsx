import { type NextPage } from "next";
import { Grid, Card, Col } from "@tremor/react"
import DashboardLayout from "~/components/Layouts/DashboardLayout";
import UserMaintenance from "~/components/Tables/UserMaintenance";
import PerRating from "~/components/Cards/perRating";
import UserHeading from "~/components/Dashboard/userHeading";

const Dashboard: NextPage = () => {

    return (
      <DashboardLayout>
        <div className="min-h-full">
          <header>
            <UserHeading />
          </header>
          <main>
              <Col className="my-4">
                <Card>
                  <div className="h-full">
                    <UserMaintenance />
                  </div>
                </Card>
              </Col>
              <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-4">
                <Col>
                  <PerRating /> 
                </Col>
                <Col>
                  <PerRating /> 
                </Col>
                <Col>
                  <PerRating /> 
                </Col>
              </Grid>
          </main>
        </div>
    </DashboardLayout>
  );
};

export default Dashboard;
