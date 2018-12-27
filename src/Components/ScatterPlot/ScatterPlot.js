import React, { Component} from 'react';
import * as d3 from 'd3';

class ScatterPlot extends Component {

    componentDidMount() {
        this.scatterPlotGraph();
    }
    scatterPlotGraph() {
        const margin = {left: 100, right: 10, top: 100, bottom: 100}
        const width = 700 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
        const formatTime = d3.timeFormat('%M:%S')
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const categories = ['Riders with doping allegations', 'No doping allegations']
        const legendColor = d3.scaleOrdinal()
            .domain(categories)
            .range(d3.schemeCategory10);

        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .attr('id', 'tooltip')
            .style('opacity', '0')


        const scaleY = d3.scaleTime()
            .domain([new Date(1970, 0, 1, 0, 36, 30),d3.max(this.props.data, d => d.Time)])
            .range([height, 0]);

        const scaleX = d3.scaleLinear()
            .domain(d3.extent(this.props.data, data => data.Year - 1))
            .range([0, width]);
        
        const svg = d3.select('#scatterPlot')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
        
        svg.append('text')
            .attr('id', 'title')
            .attr('x', width/2)
            .attr('y', 0 + margin.top/2)
            .text('Doping in Professional Bicycle Racing')
        
        const g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')

        const xAxis = d3.axisBottom(scaleX)
            .tickFormat(d3.format('d'));  
        g.append('g')
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        const yAxis = d3.axisLeft(scaleY)
            .tickFormat(formatTime)
        g.append('g')
            .attr('id', 'y-axis')
            .call(yAxis)

        const legend = g.append('g')
            .attr('id', 'legend')
            .attr('transform', 'translate(' + (width - 10) + ', ' + (height - 100) + ')')

        
        categories.forEach((category, i) => {
            const legendRow = legend.append('g')
                .attr('transform', 'translate(0,' + (i*20) + ')')
            
            legendRow.append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', legendColor(category));
            legendRow.append('text')
                .attr('x', -10)
                .attr('y', 10)
                .attr('text-anchor', 'end')
                .style('text-transform', 'capitalize')
                .text(category)
        })
        const cricles = g.selectAll('circle')
            .data(this.props.data);

        const circle = cricles.enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('data-xvalue', d => d.Year)
            .attr('data-yvalue', d => d.Time)
            .attr('data-legend', d => d.Doping !== '' ? 'Riders with doping allegations' : 'No doping allegations')
            .attr('cx', d => scaleX(d.Year))
            .attr('cy', d => scaleY(d.Time))
            .attr('r', 5)
            .style('fill', d => color(d.Doping === '') );
        
        circle.on('mouseover', d => {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(
                `
                <p>Name: ${d.Name}</p>
                <p>Nationality: ${d.Nationality}</p>
                <p>Time: ${formatTime(d.Time)}</p>
                <p>Year: ${d.Year}</p>
                `
            ).attr('data-year', d.Year)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px')
        })
        circle.on('mouseout', d => {
            tooltip.transition()
                .duration(200)
                .style('opacity', 0)
        })
    }
    render() {
        return <div id='scatterPlot'></div>
    }
}

export default ScatterPlot;