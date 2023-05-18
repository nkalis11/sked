import { type NextPage } from "next";
import { useUser } from "@clerk/clerk-react";
import { Grid, Card, Text, Metric, Title, Color, CategoryBar, Legend } from "@tremor/react"
import Testing from "~/components/Dashboard/testing";
import { api } from "~/utils/api";
import DashboardLayout from "~/components/Layouts/DashboardLayout";
import InviteMember from "~/components/Forms/InviteMember";

const categories: {
  title: string;
  metric: string;
  subCategoryPercentageValues: number[];
  subCategroyColors: Color[];
  subCategoryTitles: string[];
}[] = [
  {
    title: "Periodic Accomplishment Rating",
    metric: "30%",
    subCategoryPercentageValues: [30, 70],
    subCategroyColors: ["emerald", "red"],
    subCategoryTitles: ["Completed", "Incomplete"],
  },
  {
    title: "Administrative Accomplishment Rating",
    metric: "50%",
    subCategoryPercentageValues: [50, 50],
    subCategroyColors: ["indigo", "purple"],
    subCategoryTitles: ["Completed", "Incomplete"],
  },
  {
    title: "Spot Check Acomplishment Rating",
    metric: "40%",
    subCategoryPercentageValues: [40, 60],
    subCategroyColors: ["emerald", "rose"],
    subCategoryTitles: ["Completed", "Incomplete"],
  },
];

const Dashboard: NextPage = () => {

    return (
      <DashboardLayout>
        <div className="min-h-full">
          <header>
              <Title className="md:text-4xl text-3xl font-bold">Maintenance Dashboard</Title>
              <Text className="md:text-lg">Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text>
            </header>
          <main className="">
            <div className="">
              <Grid numColsMd={2} numColsLg={3} className="gap-6 mt-6">
                {categories.map((item) => (
                  <Card key={item.title}>
                    <Text>{item.title}</Text>
                    <Metric>{item.metric}</Metric>
                    <CategoryBar
                      categoryPercentageValues={item.subCategoryPercentageValues}
                      colors={item.subCategroyColors}
                      className="mt-4"
                    />
                    <Legend
                      categories={item.subCategoryTitles}
                      colors={item.subCategroyColors}
                      className="mt-4"
                    />
                  </Card>
                ))}
                
              </Grid>
              <div className="mt-6">
                <Card>
                  <div className="h-96">
                    <Testing />
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
    </DashboardLayout>
  );
};

export default Dashboard;
