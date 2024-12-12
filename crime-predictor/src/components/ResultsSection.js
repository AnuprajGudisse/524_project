import React, { useEffect } from "react";
import * as d3 from "d3";

const ResultsSection = ({ predictions }) => {
    useEffect(() => {
        if (!predictions) return;

        const width = 500;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 150 };

        d3.select("#chart").selectAll("*").remove();

        const data = Object.entries(predictions).map(([key, value]) => ({
            crime: key,
            probability: value * 100,
        })).filter((d) => d.crime !== "ARSON");

        const svg = d3
            .select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const x = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.probability)])
            .range([margin.left, width - margin.right]);

        const y = d3
            .scaleBand()
            .domain(data.map((d) => d.crime))
            .range([margin.top, height - margin.bottom])
            .padding(0.1);

        svg.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", x(0))
            .attr("y", (d) => y(d.crime))
            .attr("height", y.bandwidth())
            .attr("fill", "steelblue")
            .transition()
            .duration(1000)
            .attr("width", (d) => x(d.probability) - x(0));

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(
                d3.axisBottom(x).ticks(10).tickFormat((d) => `${d}%`)
            );

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));
    }, [predictions]);

    return (
        <div className="card">
            <h2>Results</h2>
            <div id="chart"></div>
        </div>
    );
};

export default ResultsSection;
