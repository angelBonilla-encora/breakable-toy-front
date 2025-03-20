import { useGetMetricsQuery } from "@/redux/api/inventoryApi";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@heroui/react";
import { Metric } from "../models";


const columns = [
  {
    key: "categoryName",
    label: "",
  },
  {
    key: "totalProductsInStock",
    label: "Total products in Stock",
  },
  {
    key: "totalValueInStock",
    label: "Total Value in Stock",
  },
  {
    key: "averagePriceInStock",
    label: "Average price in Stock",
  },
];

export const MetricsSummary = () => {
  const {data : metrics, isLoading} = useGetMetricsQuery({});

  return (
    <>
    {
        isLoading &&
          <div className="flex justify-center items-center">
            <Spinner color="default" label="Loading..." /> 
          </div> 
      }
    <Table className="mt-10">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={metrics || []}>
        {(metric : Metric) => (
          <TableRow key={metric.categoryName}>
            {(columnKey) => {
              if (
                columnKey === "totalValueInStock" ||
                columnKey === "averagePriceInStock"
              ) {
                return <TableCell>$ {getKeyValue(metric, columnKey)}</TableCell>;
              }

              return <TableCell>{getKeyValue(metric, columnKey)}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </>
  );
};
