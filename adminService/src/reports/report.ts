import PdfPrinter from "pdfmake";
import * as vfsFonts from 'pdfmake/build/vfs_fonts';
import fs from 'fs';
import { generatePieChart } from "./pieChart";
import { pdfContentService } from "./pdf";


export const generateSalesReport = async (categoryData: any, lastWeekorderData: any, mostSaledCategory: any, cartProducts: any, start: string, end: string, prevWeekStart: string, prevWeekEnd: string, adminId: string, reportType: string) => {
    try {
        return await generatePieChart(categoryData, lastWeekorderData).then(async (graphs: any) => {
            // console.log("🚀 ~ file: report.ts:7 ~ returnawaitgeneratePieChart ~ pieChart:", pieChart)
            return await generateSalesReportPdf(categoryData, mostSaledCategory, cartProducts, graphs, start, end, prevWeekStart, prevWeekEnd, adminId, reportType)
        })
    } catch (error) {
        console.log("🚀 ~ file: report.ts:7 ~ generateSalesReport ~ error:", error)
        throw (error);
    }
}

export const generateSalesReportPdf = async (categoryData: any, mostSaledCategory: any, cartProducts: any, chartImages: any, start: any, end: any, prevWeekStart: string, prevWeekEnd: string, adminId: string, reportType: string) => {
    try {
        let tableDataTotal = 0;
        const tableData: any = {
            headerRows: 1,
            table: {
                widths: ['*', '*', '*'],
                body: [
                    [
                        {
                            text: 'Sr No.',
                            alignment: 'center',
                            style: 'bold',
                            margin: [0, 7, 0, 7],
                            fontSize: 18
                        },
                        {
                            text: 'Category',
                            alignment: 'center',
                            style: 'bold',
                            margin: [0, 7, 0, 7],
                            fontSize: 18
                        },
                        {
                            text: 'Total (₹)',
                            alignment: 'center',
                            style: 'bold',
                            margin: [0, 7, 0, 7],
                            fontSize: 18
                        }
                    ],
                ]
            }
        };

        await Promise.all(categoryData.orderData.map((item: any, index: any) => {
            tableDataTotal += item.amount;
            tableData.table.body.push([
                {
                    text: index + 1,
                    alignment: 'center',
                    margin: [0, 7, 0, 7],
                    fontSize: 18
                },
                {
                    text: item.category,
                    alignment: 'center',
                    margin: [0, 7, 0, 7],
                    fontSize: 18
                },
                {
                    text: '₹ '+(item.amount).toLocaleString('en-IN'),
                    alignment: 'center',
                    margin: [0, 7, 0, 7],
                    fontSize: 18
                }
            ]);
        }));
        tableData.table.body.push([
            {
                colSpan: 2,
                text: `Total ${reportType[0].toUpperCase()+ reportType.slice(1)}ly Sale `,
                alignment: 'center',
                margin: [0, 10, 0, 10],
                fontSize: 20,
                bold: true,
            },
            {},
            {
                text: '₹ ' + (tableDataTotal).toLocaleString('en-IN'),
                alignment: 'center',
                margin: [0, 10, 0, 10],
                fontSize: 20,
                bold: true
            }
        ]);

        let saledCategory = {
            headerRows: 1,
            table: {
                widths: [350, 200],
                body: [
                    [
                        {
                            text: 'Sr.no',
                            alignment: 'center',
                            margin: [0, 10, 0, 10],
                            fontSize: 18
                        }, {
                            text: 'Most Saled Category',
                            alignment: 'center',
                            margin: [0, 10, 0, 10],
                            fontSize: 18
                        },
                        {
                            text: 'Count',
                            alignment: 'center',
                            margin: [0, 10, 0, 10],
                            fontSize: 18
                        }
                    ],
                ]
            }
        };

        await Promise.all(mostSaledCategory.Response.map((item: any, index: number) => {
            saledCategory.table.body.push([
                {
                    text: index + 1,
                    alignment: 'center',
                    margin: [0, 10, 0, 10],
                    fontSize: 18
                },
                {
                    text: item.category,
                    alignment: 'center',
                    margin: [0, 10, 0, 10],
                    fontSize: 18
                },
                {
                    text: item.count,
                    alignment: 'center',
                    margin: [0, 10, 0, 10],
                    fontSize: 18
                }
            ]);
        }));

        const cartProductTable: any = {
            headerRows: 1,
            table: {
                widths: [200, '*', 200],
                body: [
                    [
                        {
                            text: 'Cart Products',
                            alignment: 'center',
                            margin: [0, 10, 0, 10],
                            fontSize: 18
                        },
                        {
                            text: 'Quantity',
                            alignment: 'center',
                            margin: [0, 10, 0, 10],
                            fontSize: 18
                        },
                        {
                            text: 'Total',
                            alignment: 'center',
                            margin: [0, 10, 0, 10],
                            fontSize: 18
                        }
                    ],
                ]
            }
        };
        let totalCartPrice = 0;
        await Promise.all(cartProducts.map((item: any) => {
            totalCartPrice += item.price;
            cartProductTable.table.body.push([
                {
                    text: item.productId,
                    alignment: 'center',
                    margin: [0, 10, 0, 10],
                    fontSize: 18
                },
                {
                    text: item.quantity,
                    alignment: 'center',
                    margin: [0, 10, 0, 10],
                    fontSize: 18
                },
                {
                    text: '₹ ' + (item.price).toLocaleString('en-IN'),
                    alignment: 'center',
                    margin: [0, 10, 0, 10],
                    fontSize: 18
                }
            ]);
        }));

        cartProductTable.table.body.push([
            {
                colSpan: 2,
                text: 'Total Cart Products Price ',
                alignment: 'center',
                margin: [0, 10, 0, 10],
                fontSize: 20,
                bold: true,
            },
            {},
            {
                text: '₹ ' + (totalCartPrice).toLocaleString('en-IN'),
                alignment: 'center',
                margin: [0, 10, 0, 10],
                fontSize: 20,
                bold: true
            }
        ]);

        const printer = new PdfPrinter({
            Roboto: {
                normal: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
                bold: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
                italics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Italic.ttf'], 'base64'),
                bolditalics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-MediumItalic.ttf'], 'base64'),
            }
        });

        const docDefinitions: any = await pdfContentService(chartImages, tableData, saledCategory, mostSaledCategory.data, cartProductTable, start, end, prevWeekStart, prevWeekEnd, reportType);
        const pdfDoc = printer.createPdfKitDocument(docDefinitions, {});
        if (!fs.existsSync(`src/reports/reports`)) {
            fs.mkdirSync(`src/reports/reports`, { recursive: true });
        }
        const fileName = `${Math.random().toString(36).slice(2)}_${adminId}_weeklyreport.pdf`
        return {
            fileName: fileName,
            file: await createFile(fileName, pdfDoc)
        }
    } catch (error) {
        console.log("🚀 ~ file: report.ts:20 ~ generateSalesReportPdf ~ error:", error)
        throw (error);
    }
}

export const createFile = async (fileName: string, pdfDoc: any) => {
    return await new Promise(async (resolve, reject) => {
        let fileStream = fs.createWriteStream(`src/reports/reports/${fileName}`, 'utf8');
        await <any>pdfDoc.pipe(fileStream);
        pdfDoc.end();
        let data: Buffer;
        fileStream.on('finish', async () => {
            data = fs.readFileSync(`${process.cwd()}/src/reports/reports/${fileName}`);
            resolve(data);
        })
    });
}