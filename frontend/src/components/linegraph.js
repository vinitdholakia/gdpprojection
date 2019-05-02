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
        yearStart: 1960,
        yearEnd: new Date().getFullYear(),
        filter: {
            country: "United States of America - USA",
            year: {
                from: 1960,
                to: 2020,
            },
            maxValue: 20000,
            denomination: 1000000000
        },

    }

    onChangeDate = (e) => {
        e.persist();
        if (e.target.id == "fromyear") {
            this.setState((prev) => {
                let filter = prev.filter;
                filter.year.from = e.target.value ;
                return {
                    filter: filter
                }
            });
        } else if (e.target.id == "toyear") {
            this.setState((prev) => {
                let filter = prev.filter;
                filter.year.to = e.target.value ;
                return {
                    filter: filter
                }
            });
        }
    }

    changeCountry = (e) => {
        e.persist();
        if (e.target.value && e.target.value.split(" - ").length === 2) {
            this.makeRequest(e.target.value)
        }
    }
    makeRequest = (country)=>{
        let _c = ""
        if(!!country){
            _c = country;
            country = country.split(" - ")[1];
        }else{
            country = "USA"
        }
        api.call({
            url: "/api/graph?country="+country || "USA",
            method: "GET"
        }).then((data) => {
            let arr = ((data.data || [])[1] || []);
            let result = [];
            for (let i = 0; i < arr.length; i++) {
                let coords = {
                    x: parseInt(arr[i].date || "0"),
                    y: parseFloat(parseInt(arr[i].value || "0") / (this.state.filter.denomination))
                };
                if (!!coords.x && !!coords.y) {
                    result.push(coords);
                }
            }
            this.setState((prev) => {
                let filter = prev.filter;
                filter.country = _c;
                return {
                    filter: filter,
                    data : result
                }
            });
        }).catch((err) => {
            this.setState(() => {
                return {
                    error: err.message || "Some Error With Backend"
                }
            });
        })
    }
    componentDidMount = () => {
        this.makeRequest(this.state.filter.country);
    }

    drawChart2 = () => {
        let _d = [];
        let maxValue = 0;
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].x >= this.state.filter.year.from && this.state.data[i].x <= this.state.filter.year.to) {
                _d.push(this.state.data[i]);
                if (this.state.data[i].y > maxValue) {
                    maxValue = Math.ceil(this.state.data[i].y)
                }
            }
        }
        const el = ReactFauxDOM.createElement("div");
        var margin = { top: 50, right: 50, bottom: 50, left: 50 };
        var width = 900 - margin.left - margin.right;
        var height = 600 - margin.top - margin.bottom;
        var xScale = d3.scaleLinear()
            .domain([this.state.filter.year.from, this.state.filter.year.to])
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([height, 0]);
        var line = d3.line()
            .x(function (d, i) { return xScale(d.x); })
            .y(function (d) { return yScale(d.y); })
            .curve(d3.curveMonotoneX)
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

        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate(" + (width / 2) + "," + (height - (-100 / 3)) + ")")  // centre below axis
            .text("Year");
        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate(" + (-75 / 2) + "," + (height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Value in Billion");
        svg.append("path")
            .datum(_d || [])
            .attr("class", "line")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

        svg.selectAll(".dot")
            .data(_d)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function (d, i) { return xScale(d.x) })
            .attr("cy", function (d) { return yScale(d.y) })
            .attr("r", 3);
        return el.toReact();
    }
    render() {
        let years = [];
        let ye = this.state.yearEnd;
        for (let i = 0; i < this.state.yearEnd - this.state.yearStart; i++) {
            years.push(ye--);
        }
        return (
            <div style={{ margin: "20px" }}>
                <h4></h4>
                <div className="row text-left">
                    <div className="col col-md-3">
                        <h5>Filters</h5>
                        <form>
                            <label htmlFor="country">Select Country</label>
                            <select className="form-control" id="country" onChange={this.changeCountry}>
                                <option>United States Of America - USA</option>
                                <option>Africa - AFR</option>
                                <option>China - CN</option>
                                <option>Australia - AUS</option>
                            </select>
                            <br></br>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="fromyear">From</label>
                                    <select className="form-control" id="fromyear" onChange={this.onChangeDate}>
                                        {
                                            years.slice(0).reverse().map(x =>{
                                                return <option>{x}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="toyear">To</label>
                                    <select className="form-control" id="toyear" onChange={this.onChangeDate}>
                                    {
                                        years.map(x =>{
                                            return <option>{x}</option>
                                        })
                                    }
                                    </select>
                                </div>
                            </div>
                            <br></br>
                            {/* <button type="submit" className="btn btn-secondary btn-block">Apply</button> */}
                        </form>

                    </div>
                    <div className="col col-md-9">
                        {!!this.state.error && <div className="alert alert-danger" role="alert">
                            Oops!! {this.state.error}
                        </div>}
                        <h4>GDP (current US$)</h4>
                        <p><small>World Bank national accounts data, and OECD National Accounts data files.</small></p>
                        <h5><i>{this.state.filter.country}</i></h5>
                        {!!(this.state.data || []).length && this.drawChart2()}
                        {!(this.state.data || []).length && <p>No data</p>}
                    </div>
                </div>
            </div>
        )
    }
}
