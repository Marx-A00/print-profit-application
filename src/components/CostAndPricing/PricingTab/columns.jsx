// @ts-check

import * as calc from './calculations';
import {
  AddCostHeader,
  ConsistentNumericCell,
  DollarCell,
  PercentCell,
  ProductNameCell,
  TotalSellingPriceCell,
} from './cells';
import * as fmt from './formats';
import { aggregate } from './utils';

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
      productKey: 'quantity',
    },
  },
  {
    accessorKey: 'selling_price_per_unit',
    header: 'Selling Price',
    cell: ConsistentNumericCell,
    meta: {
      inputMode: 'decimal',
      adornment: '$',
      productKey: 'selling_price_per_unit',
    },
  },
  {
    id: 'total_selling_price',
    // Total selling price can be null, in which case we're supposed to derive
    // it from the product.
    accessorFn: calc.totalSellingPrice,
    header: 'Total Selling Price',
    cell: TotalSellingPriceCell,
    aggregationFn: 'sum',
    footer: ({ table, column }) => {
      const aggregate = column.getAggregationFn();
      const { rows } = table.getCoreRowModel();
      /** @type {number?} */
      const totalSellingPrice = aggregate?.('total_selling_price', [], rows);
      return fmt.currency(totalSellingPrice);
    },
    meta: {
      inputMode: 'decimal',
      adornment: '$',
      productKey: 'total_selling_price',
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
      /** @type {number?} */
      const totalCreditCardFee = aggregate?.('creditCardFee', [], rows);
      return fmt.currency(totalCreditCardFee);
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
      /** @type {number?} */
      const totalVariableCosts = aggregate?.('totalVariableCosts', [], rows);
      return fmt.currency(totalVariableCosts);
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
  meta: {
    productKey: 'estimated_hours',
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
      /** @type {number?} */
      const totalContribution = aggregate?.('contributionDollars', [], rows);
      return fmt.currency(totalContribution);
    },
  },
  {
    accessorFn: calc.contributionMargin,
    header: 'Contribution %',
    cell: PercentCell,
    footer: ({ table }) => {
      const totalContribution = aggregate(table, 'contributionDollars') ?? 0;
      const totalSellingPrice = aggregate(table, 'total_selling_price') ?? 0;
      const percent = totalContribution / totalSellingPrice;
      return fmt.percent(percent);
    },
  },
  {
    accessorFn: calc.contributionPerHour,
    header: 'Contribution / Hour',
    cell: DollarCell,
    footer: ({ table }) => {
      const totalContribution = aggregate(table, 'contributionDollars') ?? 0;
      const totalHours = aggregate(table, 'estimated_hours') ?? 0;
      const perHour = totalHours === 0 ? 0 : totalContribution / totalHours;
      return fmt.currency(perHour);
    },
  },
];
