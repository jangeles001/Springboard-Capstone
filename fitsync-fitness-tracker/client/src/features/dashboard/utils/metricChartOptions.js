import { CHART_COLORS } from "./chartColors";

export const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,

  layout: {
    padding: {
      top: 16,
      bottom: 8,
      left: 8,
      right: 8,
    },
  },

  plugins: {
    legend: {
      position: "top",
      align: "center",
      labels: {
        boxWidth: 10,
        usePointStyle: true,
        color: CHART_COLORS.dark,
        font: {
          size: 12,
          weight: "500",
        },
      },
    },

    tooltip: {
      backgroundColor: "#111827",
      titleColor: "#f9fafb",
      bodyColor: "#e5e7eb",
      cornerRadius: 10,
      padding: 12,
      displayColors: false,
    },

    title: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: CHART_COLORS.gray,
        maxRotation: 0,
      },
    },

    y: {
      beginAtZero: true,
      grid: {
        color: "#e5e7eb",
        drawBorder: false,
      },
      ticks: {
        color: "#6b7280",
        precision: 0,
        maxTicksLimit: 5,
        callback: value => value.toLocaleString(),
      },
    },
  },
};

export const volumeOptions = {
  ...baseOptions,

  scales: {
    ...baseOptions.scales,

    y: {
      ...baseOptions.scales.y,
      ticks: {
        color: "#6b7280",
        stepSize: 100,
        callback: value => `${value.toLocaleString()} lbs`,
      },
    },
  },
};

export const comboOptions = {
  ...baseOptions,

  interaction: {
    mode: "index",
    intersect: false,
  },

  scales: {
    x: {
      stacked: true, // ✅ REQUIRED
    },

    y: {
      ...baseOptions.scales.y,
      stacked: true, // ✅ REQUIRED
      position: "left",
      title: {
        display: true,
        text: "Volume",
      },
    },

    y1: {
      beginAtZero: true,
      position: "right",
      grid: { drawOnChartArea: false },
      title: {
        display: true,
        text: "Intensity",
      },
    },
  },
};

export const FrequencyOptions = {
  ...baseOptions,

  interaction: {
    mode: "index",
    intersect: false,
  },

  scales: {
    x: {
      stacked: true,
    },

    y: {
      ...baseOptions.scales.y,
      stacked: true, 
      position: "left",
      title: {
        display: true,
        text: "Volume",
      },
    },

    y1: {
      beginAtZero: true,
      position: "right",
      grid: { drawOnChartArea: false },
      title: {
        display: true,
        text: "Minutes",
      },
    },
  },
};