// @ts-check

import * as calc from './calculations';
import {
  AddCostHeader,
  ConsistentNumericCell,
  DollarCell,
  PercentCell,
  ProductNameCell,
} from './cells';

/**
 * Consistent columns that are always present.
 * @type {import("./data-types").ProductColumnDef[]}
 */
export const consistentColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ProductNameCell,
    footer: 'Total',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ConsistentNumericCell,
    aggregationFn: 'sum',
    footer: ({ table, column }) => {
      const aggregate = column.getAggregationFn();
      const { rows } = table.getCoreRowModel();
      return aggregate?.('quantity', [], rows);
    },
    meta: {
      inputMode: 'numeric',
    },
  },
  {
    accessorKey: 'selling_price',
    header: 'Selling Price',
    cell: ConsistentNumericCell,
    meta: {
      inputMode: 'decimal',
      adornment: '$',
    },
  },
  {
    accessorKey: 'total_selling_price',
    header: 'Total Selling Price',
    cell: ConsistentNumericCell,
    aggregationFn: 'sum',
    footer: ({ table, column }) => {
      const aggregate = column.getAggregationFn();
      const { rows } = table.getCoreRowModel();
      const totalSellingPrice = aggregate?.('total_selling_price', [], rows);
      return totalSellingPrice.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
      });
    },
    meta: {
      inputMode: 'decimal',
      adornment: '$',
    },
  },
];

/**
 * @type {import("./data-types").ProductColumnDef}
 */
export const addDynamicCostColumn = {
  id: 'addDynamicCost',
  header: AddCostHeader,
};

/** @type {import("./data-types").ProductColumnDef[]} */
export const calculatedCosts = [
  {
    id: 'creditCardFee',
    accessorFn: calc.creditCardFee,
    header: 'Credit Card Fee',
    cell: DollarCell,
    aggregationFn: 'sum',
    footer: ({ table, column }) => {
      const aggregate = column.getAggregationFn();
      const { rows } = table.getCoreRowModel();
      const totalCreditCardFee = aggregate?.('creditCardFee', [], rows);
      return totalCreditCardFee.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
      });
    },
  },
  {
    id: 'totalVariableCosts',
    accessorFn: calc.totalVariableCosts,
    header: 'Total Variable Costs',
    cell: DollarCell,
    aggregationFn: 'sum',
    footer: ({ table, column }) => {
      const aggregate = column.getAggregationFn();
      const { rows } = table.getCoreRowModel();
      const totalVariableCosts = aggregate?.('totalVariableCosts', [], rows);
      return totalVariableCosts.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
      });
    },
  },
];

/**
 * This has to be separated out from some other columns, since while it's
 * editable, it's below some calculated costs.
 * @type {import('./data-types').ProductColumnDef}
 */
export const estimatedHoursColumn = {
  accessorKey: 'estimated_hours',
  header: 'Estimated Hours',
  cell: ConsistentNumericCell,
  aggregationFn: 'sum',
  footer: ({ table, column }) => {
    const aggregate = column.getAggregationFn();
    const { rows } = table.getCoreRowModel();
    return aggregate?.('estimated_hours', [], rows);
  },
};

/** @type {import("./data-types").ProductColumnDef[]} */
export const contributionColumns = [
  {
    id: 'contributionDollars',
    accessorFn: calc.contribution,
    header: 'Contribution $',
    cell: DollarCell,
    // This happens to work, but it's not how the spreadsheet calculates it.
    aggregationFn: 'sum',
    footer: ({ table, column }) => {
      const aggregate = column.getAggregationFn();
      const { rows } = table.getCoreRowModel();
      const totalContribution = aggregate?.('contributionDollars', [], rows);
      return totalContribution.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
      });
    },
  },
  {
    accessorFn: calc.contributionMargin,
    header: 'Contribution %',
    cell: PercentCell,
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      const aggregateContributionDollars = table
        .getColumn('contributionDollars')
        ?.getAggregationFn();
      const aggregateTotalSellingPrice = table
        .getColumn('total_selling_price')
        ?.getAggregationFn();
      const totalContribution = aggregateContributionDollars?.(
        'contributionDollars',
        [],
        rows,
      );
      const totalSellingPrice = aggregateTotalSellingPrice?.(
        'total_selling_price',
        [],
        rows,
      );
      const percent = totalContribution / totalSellingPrice;
      return percent.toLocaleString(undefined, {
        style: 'percent',
      });
    },
  },
  {
    accessorFn: calc.contributionPerHour,
    header: 'Contribution / Hr',
    cell: DollarCell,
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      const aggregateContribution = table
        .getColumn('contributionDollars')
        ?.getAggregationFn();
      const aggregateEstimatedHours = table
        .getColumn('estimated_hours')
        ?.getAggregationFn();

      const totalContribution = aggregateContribution?.(
        'contributionDollars',
        [],
        rows,
      );
      const totalHours = aggregateEstimatedHours?.('estimated_hours', [], rows);
      const perHour = totalHours === 0 ? 0 : totalContribution / totalHours;
      return perHour.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
      });
    },
  },
];
