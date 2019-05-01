import React, {
    Component
} from 'react'
export default class LineGraph extends Component {
    state = {}
    componentDidMount = ()=>{
        
    }
    render() {
        return (
            <div style={{ margin: "20px" }}>
                <h4></h4>
                <div className="row text-left">
                    <div className="col col-md-3">
                        <h5>Filters</h5>
                        <form>
                            <label for="country">Select Country</label>
                            <select class="form-control" id="country">
                                <option>World</option>
                                <option>United States Of America</option>
                                <option>Africa</option>
                                <option>Australia</option>
                            </select>
                            <br></br>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label for="fromyear">From</label>
                                    <select class="form-control" id="fromyear">
                                        <option>World</option>
                                        <option>United States Of America</option>
                                        <option>Africa</option>
                                        <option>Australia</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label for="toyear">To</label>
                                    <select class="form-control" id="toyear">
                                        <option>World</option>
                                        <option>United States Of America</option>
                                        <option>Africa</option>
                                        <option>Australia</option>
                                    </select>
                                </div>
                            </div>
                            <br></br>
                            <button type="submit" class="btn btn-secondary btn-block">Filter</button>
                        </form>

                    </div>
                    <div className="col col-md-9">
                        <h5>GDP (current US$)</h5>
                        <p><small>World Bank national accounts data, and OECD National Accounts data files.</small></p>
                    </div>
                </div>
            </div>
        )
    }
}
