<template>
  <div>
    <div style="width: 400px">
      <div style="display: flex; justify-content: center">
        <button type="button" @click="shuffleData">Shuffle</button>
        <button type="button" @click="switchLegend">Switch legends</button>
      </div>
      <DoughnutChart v-bind="doughnutChartProps" @chart:click="handleSegmentClick" />
      <div v-if="clickedSegment" style="margin-top: 20px">
        Selected: {{ clickedSegment.label }} ({{ clickedSegment.value }})
      </div>
    </div>
    <TableComponent />
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { shuffle } from "lodash";
import { DoughnutChart, useDoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import type { ChartData, ChartOptions, ActiveElement, ChartEvent } from "chart.js";

import TableComponent from "@/components/TableComponent.vue";

Chart.register(...registerables);

interface SegmentData {
  label: string;
  value: number;
  color: string;
}

export default {
  name: "App",
  components: { DoughnutChart, TableComponent },
  setup() {
    const dataValues = ref([30, 40, 60, 70, 5]);
    const toggleLegend = ref(true);
    const clickedSegment = ref<SegmentData | null>(null);

    const testData = computed<ChartData<"doughnut">>(() => ({
      labels: ["Paris", "Nîmes", "Toulon", "Perpignan", "Autre"],
      datasets: [
        {
          data: dataValues.value,
          backgroundColor: ["#77CEFF", "#0079AF", "#123E6B", "#97B0C4", "#A5C8ED"],
        },
      ],
    }));

    const options = computed<ChartOptions<"doughnut">>(() => ({
      cutout: "90%",
      plugins: {
        legend: {
          position: toggleLegend.value ? "top" : "bottom",
        },
        title: {
          display: true,
          text: "Chart.js Doughnut Chart",
        },
      },
      onClick: handleSegmentClick,
    }));

    const { doughnutChartProps, doughnutChartRef } = useDoughnutChart({
      chartData: testData,
      options,
    });

    function shuffleData() {
      dataValues.value = shuffle(dataValues.value);
      clickedSegment.value = null;
    }

    function switchLegend() {
      toggleLegend.value = !toggleLegend.value;
    }

    function handleSegmentClick(event: ChartEvent, elements: ActiveElement[]) {
      if (elements.length > 0) {
        const clickedElement = elements[0];
        const segmentIndex = clickedElement.index;

        clickedSegment.value = {
          label: testData.value.labels?.[segmentIndex] ?? "Unknown",
          value: testData.value.datasets[0].data[segmentIndex] as number,
          color: testData.value.datasets[0].backgroundColor?.[segmentIndex] as string,
        };

        console.log("Clicked segment:", clickedSegment.value);

        // Додаткова логіка обробки кліку
        // Наприклад, відправка даних на сервер або зміна стану
      } else {
        clickedSegment.value = null;
      }
    }

    return {
      shuffleData,
      switchLegend,
      testData,
      options,
      doughnutChartRef,
      doughnutChartProps,
      handleSegmentClick,
      clickedSegment,
    };
  },
};
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
