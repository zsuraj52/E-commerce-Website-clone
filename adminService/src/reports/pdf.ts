import moment from "moment";

export const pdfContentService = async (chartImages: any, tableData: any, saledCategory: any, saleCount: number, cartProductTable: any, start: string, end: string, prevWeekStart: string, prevWeekEnd: string, reportType: string) => {
    return {
        pageSize: 'A3',
        pageOrientation: 'landscape',
        content: [
            {
                alignment: 'justify',
                columns: [
                    {
                        alignment: 'center', image: 'data:image/png;base64,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', width: 300, heigh: 100
                    },
                    {
                        alignment: 'right',
                        text: [
                            { text: '\n' },
                            { text: 'Company \n', bold: true, fontSize: 20 },
                            { text: "201, 2nd Flr, Adamji Building," + '\n', fontSize: 15 },
                            { text: "Syed Mukri Street,", fontSize: 15 },
                            { text: "Katha Bazar, Chinch Bunder," + '\n', fontSize: 15 },
                            { text: "Mumbai, Maharashtra, 400009" + '\n', fontSize: 15 },
                            { text: "Contact: 020-222344956", fontSize: 15 }
                        ]
                    }
                ]
            },
            {
                text: [
                    { text: 'Date :\n', bold: true, fontSize: 16 },
                    { text: 'From :-' + start + '    ', fontSize: 16 },
                    { text: 'To :-' + end, fontSize: 16 }
                ]
            },
            { text: '\n' },
            {
                canvas:
                    [
                        {
                            type: 'line',
                            x1: 1100, y1: 0,
                            x2: 0, y2: 0,
                        }
                    ]
            },
            { text: '\n\n\n' },

            { fontSize: 20, text: `Presenting the ${reportType}ly Sales Report, a comprehensive overview of our website's performance over the past week. \n\nThe report includes sales per category, depicted in an illustrative pie chart, and a comparative analysis of sales between the current and previous ${reportType}. Additionally, we highlight our most popular category.As you analyze this data, consider its value in understanding customer behavior. \n\nUtilize the insights to enhance our customer service and overall experience. By identifying the most popular category, we can further improve our services to cater to customer preferences and maximize sales opportunities.\nFurthermore, the report sheds light on products added to carts but not ordered, providing crucial insights into potential missed opportunities. Let's strategize on converting these abandoned carts into successful purchases.\n\nLet's work together to capitalize on this valuable information and drive our business to new heights. Your dedication and efforts are instrumental in our continued success.` },
            { text: '\n\n' },

            {
                alignmnet: 'center',
                columns: [
                    {
                        width: '50%',
                        alignment: 'center',
                        table: {
                            widths: [300, 200],
                            body: [
                                [{ text: `Previous ${reportType[0].toUpperCase()+ reportType.slice(1)} Sale`, margin: [0, 5, 0, 10] }, { text: 'Sale Value', margin: [0, 5, 0, 10] }],
                                [{ text: `${moment(prevWeekStart).format('YYYY-MM-DD')} to ${moment(prevWeekEnd).format('YYYY-MM-DD')}`, margin: [0, 3, 0, 10] }, { text: '₹ ' + (chartImages.prevSale).toLocaleString('en-IN'), margin: [0, 3, 0, 10] }],
                            ]
                        },
                        layout: {
                            fillColor: function (rowIndex: any) {
                                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                            }
                        }
                    },
                    {
                        width: '50%',
                        alignment: 'center',
                        table: {
                            widths: [300, 200],
                            body: [
                                [{ text: `Current ${reportType[0].toUpperCase()+ reportType.slice(1)} Sale`, margin: [0, 5, 0, 10] }, { text: 'Sale', margin: [0, 5, 0, 10] }],
                                [{ text: `${start} to ${end}`, margin: [0, 3, 0, 10] }, { text: '₹ ' + (chartImages.curSale).toLocaleString('en-IN'), margin: [0, 3, 0, 10] }],
                            ]
                        },
                        layout: {
                            fillColor: function (rowIndex: any) {
                                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                            }
                        }
                    },
                ]
            },
            { text: '\n\n' },
            {
                alignmnet: 'center',
                columns: [
                    {
                        width: '50%',
                        alignment: 'center',
                        table: {
                            widths: [300, 200],
                            body: [
                                [{ text: `Current ${reportType[0].toUpperCase()+ reportType.slice(1)} Sale Count`, margin: [0, 5, 0, 10] }, { text: 'Count', margin: [0, 5, 0, 10] }],
                                [{ text: `${start} to ${end}`, margin: [0, 3, 0, 10] }, { text: saleCount, margin: [0, 3, 0, 10] }],
                            ]
                        },
                        layout: {
                            fillColor: function (rowIndex: any) {
                                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                            }
                        }
                    },
                    {
                        width: '50%',
                        alignment: 'center',
                        table: {
                            widths: [300, 200],
                            body: [
                                [{ text: `% revenue per last ${reportType[0].toUpperCase()+ reportType.slice(1)}`, margin: [0, 5, 0, 10] }, { text: 'Sale', margin: [0, 5, 0, 10] }],
                                [{ text: `${start} to ${end}`, margin: [0, 3, 0, 10] }, { text: ((chartImages.curSale / chartImages.prevSale) * 100).toFixed(2) + ' %', margin: [0, 3, 0, 10] }],
                            ]
                        },
                        layout: {
                            fillColor: function (rowIndex: any) {
                                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                            }
                        }
                    },
                ]
            },
            { text: '\n\n\n\n\n' },
            {
                columns: [
                    { width: '55%', alignment: 'center', text: `${reportType.toUpperCase()} REPORT`, bold: true, fontSize: 20 },
                    { alignment: 'center', text: 'PIE CHART', bold: true, fontSize: 20 }
                ]
            },

            { text: '\n\n' },
            {
                columns: [
                    {
                        width: '55%',
                        alignment: 'center',
                        table: {
                            widths: [100, '*', '*'],
                            headerRows: 1,
                            dontBreakRows: true,
                            body: [
                                ...tableData.table.body
                            ]
                        },
                        layout: {
                            defaultBorder: false,
                            hLineWidth: function (i: any, node: any) {
                                return (i === 0 || i === node.table.body.length) ? 0 : 1;
                            },
                            vLineWidth: function (i: any, node: any) {
                                return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                            },
                            hLineColor: function (i: any, node: any) {
                                return (i === 0 || i === node.table.body.length) ? 'transparent' : '#aaa';
                            },
                            vLineColor: function (i: any, node: any) {
                                return (i === 0 || i === node.table.widths.length) ? 'transparent' : '#aaa';
                            },
                            fillColor: function (i: any, node: any) {
                                return (i === 0) ? '#f2f2f2' : null;
                            },
                            paddingLeft: function (i: any, node: any) { return (i === 0) ? 10 : 0; },
                            paddingRight: function (i: any, node: any) { return (i === node.table.widths.length - 1) ? 10 : 0; },
                            paddingTop: function (i: any, node: any) { return (i === 0) ? 10 : 0; },
                            paddingBottom: function (i: any, node: any) { return (i === node.table.body.length - 1) ? 10 : 0; }
                        }
                    },
                    {
                        alignment: 'center', image: String(chartImages.chart), width: 500, height: 450
                    }
                ]
            },
            { text: '\n\n' },
            {
                canvas:
                    [
                        {
                            type: 'line',
                            x1: 1100, y1: 0,
                            x2: 0, y2: 0,
                        }
                    ]
            },
            { text: '\n\n\n' },

            { text: 'Sales Comparison\n\n', bold: true, fontSize: 20 },
            {
                image: String(chartImages.barGraph), width: 700, height: 500
            },

            { text: '\n\n' },
            {
                canvas:
                    [
                        {
                            type: 'line',
                            x1: 1100, y1: 0,
                            x2: 0, y2: 0,
                        }
                    ]
            },
            { text: '\n\n' },
            {
                columns: [
                    { width: '10%', alignment: 'center', text: ' ' },
                    { width: '80%', alignment: 'center', text: 'Most Sold Category\n\n', fontSize: 20, bold: true },
                    { width: '10%', alignment: 'center', text: ' ' },
                ]

            },
            {
                columns: [
                    { width: '10%', text: '' },
                    { width: '80%', text: 'In a bustling shopping website, certain categories stand out as the most sought-after among customers. These best-selling categories demonstrate a strong consumer interest and play a pivotal role in driving significant revenue for the business. By identifying and leveraging these top-performing categories, the website can tailor its marketing strategies, expand product offerings, and enhance user experience to further capitalize on customer preferences. Analyzing the trends and patterns of these most sales categories allows the website to stay ahead in the competitive market and consistently meet the ever-evolving demands of its valued clientele.', fontSize: 18 },
                    { width: '10%', text: '' }
                ]
            },
            { text: '\n\n' },
            {
                columns: [
                    { width: '10%', alignment: 'center', text: ' ' },
                    {
                        width: '80%',
                        style: 'rotate',
                        alignment: 'center',
                        table: {
                            widths: [200, '*', 200],
                            headerRows: 1,
                            dontBreakRows: true,
                            body: [
                                ...saledCategory.table.body
                            ]
                        },
                        layout: {
                            hLineWidth: function (i: any, node: any) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                            },
                            vLineWidth: function (i: any, node: any) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                            },
                            hLineColor: function (i: any, node: any) {
                                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                            },
                            vLineColor: function (i: any, node: any) {
                                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                            },
                            fillColor: function (rowIndex: any) {
                                return (rowIndex === 0) ? '#CCCCCC' : null;
                            },
                            paddingLeft: function (i: any, node: any) { return (i === 0) ? 10 : 0; },
                            paddingRight: function (i: any, node: any) { return (i === node.table.widths.length - 1) ? 10 : 0; },
                            paddingTop: function (i: any, node: any) { return (i === 0) ? 10 : 0; },
                            paddingBottom: function (i: any, node: any) { return (i === node.table.body.length - 1) ? 10 : 0; }
                        }
                    },
                    { width: '10%', alignment: 'center', text: ' ' }
                ]
            },
            { text: '\n\n' },
            {
                canvas: [
                    {
                        type: 'line',
                        x1: 1100, y1: 0,
                        x2: 0, y2: 0,
                    }
                ]
            },
            { text: '\n\n' },
            {
                columns: [
                    { width: '10%', alignment: 'center', text: ' ' },
                    { alignment: 'center', width: '80%', text: 'Cart Products\n\n', bold: true, fontSize: 20 },
                    { width: '10%', alignment: 'center', text: ' ' }
                ]
            },
            {
                columns: [
                    { width: '10%', text: "", alignment: 'center' },
                    { width: '80%', text: 'This is a comprehensive analysis of products and their quantities that were added to carts but not proceeded to orders. By scrutinizing the frequency and trends of abandoned carts, we can estimate the potential revenue from successful conversions. The revenue lost due to cart abandonment reveals unrealized sales opportunities, pointing to areas for enhancing user experience, checkout process, and marketing strategies on the website.', fontSize: 18 },
                    { width: '10%', text: "", alignment: 'center' }
                ]
            },
            { text: '\n\n' },
            {
                columns: [
                    { width: '10%', alignment: 'center', text: ' ' },
                    {
                        width: '80%',
                        alignment: 'center',
                        table: {
                            widths: ['*', 150, 250],
                            headerRows: 1,
                            dontBreakRows: true,
                            body: [
                                ...cartProductTable.table.body
                            ]
                        },
                        layout: {
                            hLineWidth: function (i: any, node: any) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                            },
                            vLineWidth: function (i: any, node: any) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                            },
                            hLineColor: function (i: any, node: any) {
                                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                            },
                            vLineColor: function (i: any, node: any) {
                                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                            },
                            fillColor: function (rowIndex: any) {
                                return (rowIndex === 0) ? '#CCCCCC' : null;
                            },
                            paddingLeft: function (i: any, node: any) { return (i === 0) ? 10 : 0; },
                            paddingRight: function (i: any, node: any) { return (i === node.table.widths.length - 1) ? 10 : 0; },
                            paddingTop: function (i: any, node: any) { return (i === 0) ? 10 : 0; },
                            paddingBottom: function (i: any, node: any) { return (i === node.table.body.length - 1) ? 10 : 0; }
                        }
                    },
                    { width: '10%', alignment: 'center', text: ' ' },
                ]
            },
            { text: '\n\n\n' },
            { text: 'SUMMARY\n\n', bold: true, fontSize: 25 },
            { fontSize: 20, text: `In conclusion, this ${reportType} Sales Report has provided invaluable insights into our website's performance and customer behavior. By analyzing the sales per category, comparing ${reportType}ly trends, and identifying our most popular category, we have gained essential data to make informed decisions.\nLet's leverage this information to enhance our customer service, optimize marketing strategies, and drive sales growth. As we strive to convert abandoned carts into successful orders, we can tap into untapped potential and maximize revenue.We extend our heartfelt appreciation to the entire team for their dedication and hard work in contributing to our success. Together, let's implement the insights from this report and continue to elevate our website's performance.Should you have any questions or need further analysis, please don't hesitate to reach out. \nLet's work collaboratively to achieve even greater achievements in the coming ${reportType}s.Thank you all for your commitment and continued support.` },
            { text: '\n\n\n\n\n' },
            { text: 'Note:-  This report is confidential and intended solely for the designated recipients. Any unauthorized dissemination or use is strictly prohibited.', color: 'red' },
        ],
        footer: function (currentPage: number, pageCount: number) {
            if (currentPage === pageCount) {
                return {
                    columns: [
                        {
                            text: 'Shippr\n201, 2nd Flr, Adamji Building, Syed Mukri Street,Katha Bazar, \nChinch Bunder, Mumbai, Maharashtra, 400009\nPhone: +1 (555) 123-4567 | Email: sales@company.com\nWebsite: www.company.com | Follow us on: Facebook, Twitter, Instagram',
                            alignment: 'center',
                            fontSize: 10,
                        },
                        {
                            text: '© 2023 Shippr. All rights reserved',
                            alignment: 'center',
                            fontSize: 10,
                        },
                    ],
                    margin: [20, 0, 20, 0],
                };
            }
        },
    }
}