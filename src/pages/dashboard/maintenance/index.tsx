import { type NextPage } from "next";
import { useUser } from "@clerk/clerk-react";
import { Grid, Col, Card, Text, Metric } from "@tremor/react"
import Testing from "~/components/Dashboard/testing";
import { api } from "~/utils/api";
import DashboardLayout from "~/components/Layouts/DashboardLayout";
import InviteMember from "~/components/Forms/InviteMember";

const Dashboard: NextPage = () => {

    return (
         <DashboardLayout>
    <div className="min-h-full">
      <header className="bg-white shadow">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
        </header>
      <main className="">
        <div className="">
          <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-4">
            <Col numColSpan={1} numColSpanLg={2}>
              <Card>
                <InviteMember />
              </Card>
            </Col>
            <Card>
              <Text>Title</Text>
              <Metric>KPI 2</Metric>
            </Card>
            <Col>
              <Card>
                <Text>Title</Text>
                <Metric>KPI 3</Metric>
              </Card>
            </Col>
            <Col numColSpan={1} numColSpanLg={2}>
              <Card>
                <Text>Title</Text>
                <Metric>KPI 5</Metric>
              </Card>
            </Col>
            <Col numColSpan={1} numColSpanLg={3}>
              <Card>
                <Testing />
              </Card>
            </Col>
          </Grid>
          
        </div>
      </main>
    </div>
    </DashboardLayout>
  );
};

export default Dashboard;
