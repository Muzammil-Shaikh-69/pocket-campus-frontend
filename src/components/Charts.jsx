import { Doughnut } from 'react-chartjs-2';
import { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Charts({ completed = 0, pending = 0, setExporters }) {
  const chartRef = useRef(null);
  const data = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ['#16a34a', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };
  const options = { plugins: { legend: { position: 'bottom' } } };

  useEffect(() => {
    if (!setExporters) return;
    const toDataUrl = () => {
      const chart = chartRef.current;
      if (!chart) return null;
      try {
        return chart.toBase64Image('image/png', 1);
      } catch {
        return null;
      }
    };
    const exporters = {
      toPNG: () => {
        const url = toDataUrl();
        if (!url) return;
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.png';
        a.click();
      },
      toPDF: () => {
        const url = toDataUrl();
        if (!url) return;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
        const img = url;
        const pageWidth = pdf.internal.pageSize.getWidth();
        // assume square chart ~ 384px width
        const imgWidth = pageWidth - 40;
        pdf.addImage(img, 'PNG', 20, 30, imgWidth, imgWidth);
        pdf.save('report.pdf');
      },
    };
    setExporters(exporters);
  }, [setExporters, completed, pending]);

  return (
    <div className="w-full md:w-96">
      <Doughnut ref={chartRef} data={data} options={options} />
    </div>
  );
}



