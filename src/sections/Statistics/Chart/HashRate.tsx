import type { ApexOptions } from 'apexcharts';

import dayjs from 'dayjs';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import CardHeader from '@mui/material/CardHeader';

import { formatWeekNumber } from 'src/utils/format-time';

import { ChartSelect } from 'src/components/chart';

import { useFetchBlocks } from '../useApollo';

// ----------------------------------------------------------------------

const series = [
  { value: 'block', label: 'Block' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export default function HashRate() {
  const [selectedSeries, setSelectedSeries] = useState('Block');

  const handleChangeSeries = useCallback((newValue: string) => {
    setSelectedSeries(newValue);
  }, []);

  const currentSeries = series.find((i) => i.label === selectedSeries);

  const { loading: blocksLoading, blocks, fetchBlocks } = useFetchBlocks();

  useEffect(() => {
    fetchBlocks({ variables: { data: { type: currentSeries?.value ?? '' } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSeries]);

  const chartSeries = [
    {
      name: 'Hashrate',
      data: blocks!.map((item) => Number(((item?.hashRate! || 1) / 10 ** 9).toFixed(2))).reverse(),
      type: 'area',
    },
    {
      name: 'Sold HashPower',
      data: blocks!.map((item) => item.soldHashPower / 1000).reverse(),
      type: 'line',
    },
  ];

  const chartOptions: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: [2.5, 2.5],
    },
    grid: { show: false },
    xaxis: {
      tooltip: { enabled: false },
      tickAmount: 30,
      categories: blocks!
        .map((item) =>
          currentSeries?.value === 'week'
            ? `#${formatWeekNumber(item.baseDate)} (${dayjs(item.baseDate).utc().format('MM/DD')} - ${dayjs(item.baseDate).utc().add(6, 'day').format('MM/DD')})`
            : item.base
        )
        .reverse(),
    },
    yaxis: [
      {
        title: {
          text: 'HashRate',
        },
        labels: {
          formatter: (value: number) => `${Math.floor(value)} GH/s`,
        },
      },
      {
        opposite: true,
        title: {
          text: 'Sold HashPower',
        },
        labels: {
          formatter: (value: number) => `${value} GH/s`,
        },
        min: 0,
      },
    ],
    colors: ['#228a7c', '#ca2f31'],
    // fill: {
    //   type: 'gradient',
    //   gradient: {
    //     shade: 'light',
    //     type: 'vertical',
    //     gradientToColors: ['#d5e8e6'], // End color for line
    //     shadeIntensity: 1,
    //     opacityFrom: 1,
    //     opacityTo: 0.3,
    //     stops: [0, 90, 100],
    //   },
    // },
    fill: {
      opacity: 0.6,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: { show: false },
  };

  return (
    <Card>
      <CardHeader
        title="Hash Rate"
        action={
          <ChartSelect
            options={series.map((item) => item.label)}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
      />

      {blocksLoading ? (
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" sx={{ fontSize: 26 }} />
          <Skeleton variant="text" sx={{ fontSize: 26 }} />
          <Skeleton variant="text" sx={{ fontSize: 26 }} />
          <Skeleton variant="text" sx={{ fontSize: 26 }} />
          <Skeleton variant="text" sx={{ fontSize: 26 }} />
          <Skeleton variant="text" sx={{ fontSize: 26 }} />
          <Skeleton variant="text" sx={{ fontSize: 26 }} />
        </Paper>
      ) : (
        <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={305} />
      )}
    </Card>
  );
}
