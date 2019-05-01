import * as d3 from "d3";
import React, {
    Component
} from 'react';
import ReactFauxDOM from "react-faux-dom";
import API from '../lib/interceptor';
let api = new API();
export default class LineGraph extends Component {
    state = {
        error: "",
        data: [],
    }
    componentDidMount = () => {
        api.call({
            url: "/api/graph",
            method: "GET"
        }).then((data) => {
            let arr = ((data.data || [])[1] || []);
            let result = [];
            for (let i = 0; i < arr.length; i++) {
                let coords = {
                    x: parseInt(arr[i].date || "0"),
                    y: parseInt(parseInt(arr[i].value || "0") / 10000000000)
                };
                if (!!coords.x && !!coords.y) {
                    result.push(coords);
                }
            }
            //console.log(result)
            this.setState(() => {
                return { data: result }
            });
        }).catch((err) => {
            this.setState(() => {
                return {
                    error: err.message || "Some Error With Backend"
                }
            });
        })
    }

    drawChart2 = () => {

        const el = ReactFauxDOM.createElement("div");

        var margin = { top: 50, right: 50, bottom: 50, left: 50 };
        var width = 900 - margin.left - margin.right;
        var height = 600 - margin.top - margin.bottom;
        var n = 21;
        var xScale = d3.scaleLinear()
            .domain([1960, 2017])
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .domain([0, 2000])
            .range([height, 0]);
        var line = d3.line()
            .x(function (d, i) { return xScale(d.x); })
            .y(function (d) { return yScale(d.y); })
            .curve(d3.curveMonotoneX)
        // var dataset = d3.range(n).map(function (d) { return { "y": d3.randomUniform(1)(), "x": d3.randomUniform(1)() } })
        // console.log(dataset);
        var svg = d3.select(el).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale));
        console.log("asc", this.state.data)
        svg.append("path")
            .datum(this.state.data || [])
            .attr("class", "line")
            .attr("d", line);

        svg.selectAll(".dot")
            .data(this.state.data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function (d, i) { return xScale(d.x) })
            .attr("cy", function (d) {return yScale(d.y) })
            .attr("r", 2);
        return el.toReact();
    }
    render() {
        return (
            <div style={{ margin: "20px" }}>
                <h4></h4>
                <div className="row text-left">
                    <div className="col col-md-3">
                        <h5>Filters</h5>
                        <form>
                            <label htmlFor="country">Select Country</label>
                            <select className="form-control" id="country">
                                <option>World</option>
                                <option>United States Of America</option>
                                <option>Africa</option>
                                <option>Australia</option>
                            </select>
                            <br></br>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="fromyear">From</label>
                                    <select className="form-control" id="fromyear">
                                        <option>World</option>
                                        <option>United States Of America</option>
                                        <option>Africa</option>
                                        <option>Australia</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="toyear">To</label>
                                    <select className="form-control" id="toyear">
                                        <option>World</option>
                                        <option>United States Of America</option>
                                        <option>Africa</option>
                                        <option>Australia</option>
                                    </select>
                                </div>
                            </div>
                            <br></br>
                            <button type="submit" className="btn btn-secondary btn-block">Filter</button>
                        </form>

                    </div>
                    <div className="col col-md-9">
                        {!!this.state.error && <div className="alert alert-danger" role="alert">
                            Oops!! {this.state.error}
                        </div>}
                        <h5>GDP (current US$)</h5>
                        <p><small>World Bank national accounts data, and OECD National Accounts data files.</small></p>
                        {(this.state.data || []).length && this.drawChart2()}
                    </div>
                </div>
            </div>
        )
    }
}
