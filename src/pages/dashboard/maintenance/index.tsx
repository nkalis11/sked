import { type NextPage } from "next";
import { Grid, Card, Col } from "@tremor/react"
import DashboardLayout from "~/components/Layouts/DashboardLayout";
import UserMaintenance from "~/components/Tables/UserMaintenance";
import PerRating from "~/components/Cards/perRating";
import UserHeading from "~/components/Dashboard/userHeading";
import MaintFeed from "~/components/Dashboard/maintFeed";

const Dashboard: NextPage = () => {

    return (
      <DashboardLayout>
        <div className="min-h-full">
            <UserHeading />
              <Col className="my-4">
                <Card>
                  <div className="h-full">
                    <UserMaintenance />
                  </div>
                </Card>
              </Col>
              <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-4">
                <Col className="">
                  <Card>
                    <div className="h-full">
                      <MaintFeed />
                    </div>
                  </Card>
                </Col>
                <Col>
                  <PerRating /> 
                </Col>
              </Grid>
              
        </div>
    </DashboardLayout>
  );
};

export default Dashboard;
