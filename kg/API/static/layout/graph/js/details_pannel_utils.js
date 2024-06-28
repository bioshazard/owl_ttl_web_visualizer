function get_keywords_html(keywords){
    var keywords_html = ''
    var i = 0;
    for (var keyw of keywords) {
        var class_name = "badge-info"
        if (i % 2 === 0) {
            class_name = "badge-success"
        }
        i = i + 1
        keywords_html += '<span class="badge ' + class_name + ' ml-2 mb-2" style="font-size:15px"> ' + keyw + '<a href="#" style="font-size: 15px; color: white; margin-left:5px "> x</a> </span>'
    }
    return keywords_html
}

window.get_related_statements = function (subgraf){

    var origin = subgraf["origin"][0]
    var class_name = ""
    var statements_html ="<div class=\"collapse show \" id=\"collapseRelatedStatement\" style='max-height: 350px; overflow-y: overlay;'>"
    let parsed_nodes = []
    let statement_nodes = subgraf["nodes"].filter(node => node["tag"] === "statement_node").map(node => node["intra_id"])
    let statements_html2 = ""

    subgraf["all_results"].forEach(node => {

        if (!parsed_nodes.includes(node["intra_id"])) {
            parsed_nodes.push(node["intra_id"])
            class_name = "badge-light"
            console.log(statement_nodes)
            console.log(node["intra_id"])
            console.log(statement_nodes.includes(node["intra_id"]))
            if (statement_nodes.includes(node["intra_id"])) {
                console.log("statement node")
                statements_html += '<div class="statement-box d-flex justify-content-between align-items-center p-3 mb-2 shadow rounded ' + class_name + ' ml-2 mb-2" style="font-size:15px"> '
                    + node["statement"] +
                        '<div style="justify-content: end; display: flex">' +
                        '<a href="' + node["url"] + '" target="_blank" class="info-button-statement"><i class="bi bi-info-circle" style="margin-left: 10px"></i></a>' +
                        '<a href="#" onclick="removeStatement(' + node["intra_id"] + ')"> <i class="bi bi-x" style="color: red; font-size: 24px; margin-left: 5px"></i> </a>' +
                        '</div>' +
                    '</div>'
            }
            else
                statements_html2 += '<div class="statement-box d-flex justify-content-between align-items-center p-3 mb-2 shadow rounded ' + class_name + ' ml-2 mb-2" style="font-size:15px; opacity:0.7"> '
                + node["statement"] +
                    '<div style="justify-content: end; display: flex">' +
                        '<a href="' + node["url"] + '" target="_blank" class="info-button-statement"><i class="bi bi-info-circle" style="margin-left: 10px"></i></a>' +
                    '<a href="#" onclick="addStatement(' + node["intra_id"] + ')"> <i class="bi bi-plus" style="color: green; font-size: 24px; margin-left: 5px"></i> </a>' +
                    '</div>' +
                '</div>'
        }
    });
    statements_html += statements_html2 + "</div>"
    return statements_html
}

// subgraf["nodes"].forEach(node => {
//     if (node["tag"] === "statement_node") {
//         parsed_nodes.push(node["intra_id"])
//         class_name = "badge-light"
//         statements_html += '<div class="statement-box d-flex justify-content-between align-items-center p-3 mb-2 shadow rounded ' + class_name + ' ml-2 mb-2" style="font-size:15px"> '
//             + node["statement"] +
//             '<a href="' + node["url"]+'" target="_blank" class="info-button"><i class="bi bi-info-circle"></i></a>' +
//             '<a href="#" style="font-size: 15px; margin-left:5px; color: red" class="btn btn-light btn-sm shadow-sm" ' +
//             'onclick="removeStatement(' + node["intra_id"] + ')"> X </a>' +
//             '</div>'
//     }
// });

function inject_countries_barchart(graph){

    let parsed_nodes = []
    let countries_result = {}
    graph["all_results"].forEach(node => {
        if (node["selected"] === 1 && !parsed_nodes.includes(node["intra_id"])) {
            parsed_nodes.push(node["intra_id"])
            if (node["location"] === [''])
                countries_result["Unknown"] = (countries_result["Unknown"] || 0) + 1
            else {
                for (var loc of node["location"]) {
                    countries_result[loc] = (countries_result[loc] || 0) + 1
                }
            }
        }
    })

    console.log("Inject countries")
    console.log(countries_result)
    if (countries_result.hasOwnProperty('')){
        countries_result['unknown'] = countries_result[''];
        delete countries_result[''];
    }
    let x = []
    let x_ticks = []
    let y = []
    let sum = 0
    let max = -1
    Object.entries(countries_result).forEach(([key, value]) => {
        y.push(key)
        x_ticks.push(value)
        sum += value
        if (max === -1)
            max = value
        else if(value > max)
            max = value
    });

    x = x_ticks.map(value => value)
    console.log(x)
    console.log(x_ticks)
    console.log(y)

    var data = [{
        type: 'bar',
        orientation: 'h',
        x: x, // percentages
        y: y, // countries
        text: x, // adding % to the labels
        textposition: 'auto',
        marker: {
            color: Array(x.length).fill('#4C70AC')
        }
    }];

    // Layout configuration
    var layout = {
        yaxis: {
            title: 'Country'
        },
        xaxis: {
            tickvals: [],
            range: [0, Math.floor(max + 0.5 * max)]
        },
        margin:{
            t:5,b:5
        },
        //height: 100,  // set desired height
    };
    var config = {
        staticPlot: true,   // Setting to true makes the plot non-interactive
        displayModeBar: false  // Hides the mode bar
    };

    Plotly.newPlot('plotly-div', data, layout, config);
    $('#collapseCountry').collapse()
}
function inject_sources_barchart(graph){
    let parsed_nodes = []
    let channel_result = {}
    graph["all_results"].forEach(node => {
        if (node["selected"] === 1 && !parsed_nodes.includes(node["intra_id"])) {

            parsed_nodes.push(node["intra_id"])
            if (node["channel"] === "")
                channel_result["Unknown"] = (channel_result["Unknown"] || 0) + 1
            else {
                for (let chan of node["channel"])
                    channel_result[chan] = (channel_result[chan] || 0) + 1
            }
        }
    })
    console.log("Inject channel")
    console.log(channel_result)
    if (channel_result.hasOwnProperty('')){
        channel_result['unknown'] = channel_result[''];
        delete channel_result[''];
    }
    let x = []
    let x_ticks = []
    let y = []
    let sum = 0
    let max = -1
    Object.entries(channel_result).forEach(([key, value]) => {
        y.push(key)
        x_ticks.push(value)
        sum += value
        if (max === -1)
            max = value
        else if(value > max)
            max = value
    });

    x = x_ticks.map(value => value)
    console.log(x)
    console.log(x_ticks)
    console.log(y)



    var data = [{
        type: 'bar',
        // Changed to vertical orientation
        x: y, // Category names on the x-axis
        y: x, // Numeric values on the y-axis
        text: x.map(value => value),
        textposition: 'outside',
        insidetextanchor: 'end',  // Anchors text at the end of the bar
        marker: {
            color: Array(y.length).fill('#4C70AC')
        }
    }];

// Layout configuration
    var layout = {
        xaxis: {
            title: 'Channels',
            automargin: true,
            // Adjust other x-axis properties as needed
        },
        yaxis: {
            // Adjust y-axis properties as needed
            range: [0, max + 3]  // Normal y-axis range
        },
        margin: {
            t: 5,
            l: 50  // Adjust margin if needed
        },
        // Remove the textdirection property
    };

    var config = {
        staticPlot: true,   // Setting to true makes the plot non-interactive
        displayModeBar: false  // Hides the mode bar
    };



    Plotly.newPlot('plotly-div2', data, layout, config);
    $('#collapseChanels').collapse()
}

function inject_timeline_chart(graph){

    var container = document.getElementById('visualization');

    let parsed_nodes = []
    let countries_result = {}
    graph["all_results"].forEach(node => {
        if (node["selected"] === 1 && !parsed_nodes.includes(node["intra_id"])) {
            parsed_nodes.push(node["intra_id"])
            if (node["location"] === "") {
                if (!countries_result.hasOwnProperty("Unknown"))
                    countries_result["Unknown"] = []
                countries_result["Unknown"].push({statement: node["statement"], date: node["date"]})
            }
            else {
                if (!countries_result.hasOwnProperty(node["location"]))
                    countries_result[node["location"]] = []
                countries_result[node["location"]].push({statement: node["statement"], date: node["date"]})
            }
        }
    })
    let index = 1
    let data_set = []
    let items_before = []
    Object.entries(countries_result).forEach(([key, value]) => {
        data_set.push({id: index, content: key })
        value.forEach(value =>{
            let dateString = value.date;
            let dateParts = dateString.split(".");
            let day = parseInt(dateParts[0], 10);
            let month = parseInt(dateParts[1], 10) - 1; // JavaScript months are 0-based (0-11)
            let year = parseInt(dateParts[2], 10);

            let date = new Date(year, month, day);

            items_before.push({start: date, content: value.statement, group: index})
        })
        index = index + 1
    });

    var groups = new vis.DataSet(data_set);

    // Create a DataSet (allows two way data-binding)
    var items = new vis.DataSet(items_before);
    console.log(groups)
    console.log(items)
    // Configuration for the Timeline
    var options = {
        stack: true,
        zoomMin: 604800000,          // limită de zoom la minim o săptămână
        zoomMax: 3 * 365 * 24 * 60 * 60 * 1000
    };

    // Create a Timeline
    var timeline = new vis.Timeline(container, items, groups, options);
    $('#collapseTimeline').collapse()
}