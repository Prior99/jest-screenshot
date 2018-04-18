const ChartjsNode = require('chartjs-node');

const colors = ["rgb(255, 128, 0)", "rgb(80, 80, 255)"];

module.exports = (suite, fileName, resolve) => {
    const data = {
        labels: [""],
        datasets: suite.map((benchmark, index) => {
            return {
                label: benchmark.name,
                backgroundColor: colors[index],
                data: [benchmark.hz]
            };
        })
    };
    const type = "horizontalBar";
    const options = {
        scales: {
            xAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ],
            yAxes: [
                {
                    display: false
                }
            ]
        }
    };
    const chartNode = new ChartjsNode(1000, 200);
    chartNode.drawChart({ data, type, options })
        .then(() => chartNode.getImageBuffer("image/png"))
        .then(buffer => chartNode.getImageStream("image/png"))
        .then(streamResult => chartNode.writeImageToFile("image/png", fileName))
        .then(resolve)
        .catch(err => {
            console.error("Error drawing chart", err);
        })
}
