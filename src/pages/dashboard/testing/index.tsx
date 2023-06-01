import { NextPage } from 'next';
import DashboardLayout from '~/components/Layouts/DashboardLayout';
import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import { useState } from 'react';
import Test from '~/components/Testing/test';
import { Grid, Col, Text, Metric, Card } from '@tremor/react';
import AssigneeButton from '~/components/Buttons/updateAssignee';

const Testing: NextPage = () => {
    return (
         <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-2">
         <Col numColSpan={1} numColSpanLg={2}>
             <Card>
               <Test />
             </Card>
         </Col>
     </Grid>
    )
}
export default Testing;
