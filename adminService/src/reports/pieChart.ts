import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import fs from 'fs';

export const generatePieChart = async (categoryData: any, lastWeekorderData: any) => {
    try {
        const width = 400;
        const height = 400;
        const backgroundColour = 'white';
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });
        const rgbValues = ['rgb(255, 99, 71)', 'rgb(0, 0, 255)', 'rgb(60, 179, 113)', 'rgb(255, 165, 0)', 'rgb(238, 130, 238)', 'rgb(106, 90, 205)', 'rgb(0,255,255)', 'rgb(218,165,32)', 'rgb(128,128,0)', 'rgb(85,107,47)', 'rgb(46,139,87)', 'rgb(0,206,209)', 'rgb(219,112,147)', 'rgb(160,82,45)', 'rgb(128,128,128)', 'rgb(188,143,143)' ,'rgb(65,105,225)', 'rgb(127,255,212)', 'rgb(0,255,0)', 'rgb(205,92,92)', 'rgb(0,128,128)', 'rgb (128,0,128)', 'rgb (244,164,96)', 'rgb(255,0,0)' ];
        const configuration: any = {
            type: 'pie',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Weekly Sales Report',
                        data: [],
                        backgroundColor: [],
                        hoverOffset: 4
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        min: 0,
                        ticks: {
                            stepSize: 50000,
                            callback: function (value: any) {
                                return value;
                            }
                        }
                    }
                }
            }
        };
        await categoryData.orderData.map((obj: any, index: number) => {
            configuration.data.datasets[0].data.push(obj.amount)
            configuration.data.datasets[0].backgroundColor.push(rgbValues[index]);
            configuration.data.labels.push(obj.category)
        })

        const previousWeekComparisonChart: any = {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Sales Comparison',
                        data: [],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)'
                            
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
        }
        let curSale = 0
        await categoryData.orderData.map((obj: any) => {
            curSale += obj.amount
        })
        console.log("🚀 ~ file: pieChart.ts:88 ~ generatePieChart ~ curSale:", curSale)
        previousWeekComparisonChart.data.datasets[0].data.push(curSale);
        previousWeekComparisonChart.data.labels.push('Current Sale')

        let prevSale = 0;
        await lastWeekorderData.orderData.map((obj: any) => {
            prevSale += obj.amount;
        })
        console.log("🚀 ~ file: pieChart.ts:93 ~ awaitlastWeekorderData.map ~ prevSale:", prevSale)
        previousWeekComparisonChart.data.datasets[0].data.push(prevSale);
        previousWeekComparisonChart.data.labels.push('Previous Sale')

        const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
        const base64Image = dataUrl

        const comparisonDataUrl = await chartJSNodeCanvas.renderToDataURL(previousWeekComparisonChart);
        const comparisonDataUrlbase64Image = comparisonDataUrl
        var base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
        fs.writeFile("out.png", base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        return { chart: dataUrl, barGraph: comparisonDataUrlbase64Image, prevSale: prevSale, curSale: curSale }
    } catch (error) {
        console.log("🚀 ~ file: pieChart.ts:7 ~ generatePieChart ~ error:", error)
        throw (error);
    }
}