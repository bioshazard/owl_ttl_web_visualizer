import { CSS2DRenderer, CSS2DObject } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';

function simple_nodes(node){
    const nodeEl = document.createElement('div');
    if (node.tag=== 'fake_news'){
        nodeEl.textContent = node.statement.substring(0, 20) + "...";
        nodeEl.style.color = '#b3eae7';
        nodeEl.color = '#67f5ef';
        nodeEl.style.opacity = 0.45;

    }
    else {
        nodeEl.textContent = node.name;
        nodeEl.style.color = '#ff6f3c'
    }

    nodeEl.className = 'node-label';
    //print(nodeEl)
    return new CSS2DObject(nodeEl)
}

const doubleClickDelay = 300; // Milliseconds
let clickedNodeId = null;
let clickedNodeTimer = null;
let Graph = null
function click_node(node) {

}
function get_kg_url() {


    const nodes = $.ajax({
        type: 'GET',
        // url: 'http://localhost/eufacts4/public/GraphJson/michael_data.json',
        url: 'https://mindbugs.go.ro/get_kg',
        dataType: 'json',
        success: function (data) {
            console.log(data)
            Graph = ForceGraph3D({
                extraRenderers: [new CSS2DRenderer()]
            })


            (document.getElementById('3d-graph'))
                .graphData(data)
                .nodeColor(node =>{
                    if (node.tag=== 'fake_news')
                       return 'rgba(103, 245, 239, 0.3)'
                    else
                        return 'rgba(255, 111, 60, 0.8)'
                })
                .nodeLabel('statement')
                .nodeThreeObject(node => simple_nodes(node))
                .onNodeDragEnd(node => {
                    node.fx = node.x;
                    node.fy = node.y;
                    node.fz = node.z;
                })
                //.width(800)
                .onNodeClick(node => addInfoCard(node))
                //.linkWidth(0.3)
                .nodeThreeObjectExtend(true)

            Graph.cameraPosition(
                { z: 300 },  // new position
                { x: 0, y: 0, z: 0 },  // look-at position
                3000  // transition duration
            );
            //Container.width(100)

            let angle = 0;
            let distance = 300
            let isRotationActive = true;
            setTimeout(() => {
                setInterval(() => {
                    if (isRotationActive) {
                        Graph.cameraPosition({
                            x: distance * Math.sin(angle),
                            z: distance * Math.cos(angle)
                        });
                        angle += Math.PI / 300;
                    }
                }, 50);}, 3000);


            document.getElementById('3d-graph').addEventListener('click', event => {
                isRotationActive = false;
                //event.target.innerHTML = `${(isRotationActive ? 'Pause' : 'Resume')} Rotation`;
            });
            document.getElementById('btnAddStatement').addEventListener('click', event => {
                isRotationActive = false;
                //event.target.innerHTML = `${(isRotationActive ? 'Pause' : 'Resume')} Rotation`;
            });
        }
    })
}
get_kg_url()


function updateGraphAnalyze(data){
    origin_node = data['origin'][0]
    var my_data2 = {}
    my_data2["nodes"]= data["nodes"]
    my_data2["links"] = data['links']
    console.log(my_data2)

    var zoom_node = null
    Graph = ForceGraph3D({
        extraRenderers: [new CSS2DRenderer()]
    })

    (document.getElementById('3d-graph'))
        .graphData(my_data2)
        .dagMode('td')
        .dagLevelDistance(40)
        //.nodeAutoColorBy('tag')
        .nodeLabel('statement')
        .nodeThreeObject(node => {

            const nodeEl = document.createElement('div');
            nodeEl.style.color = '#b3eae7';
            nodeEl.color = '#67f5ef';
            nodeEl.style.opacity = 1;
            nodeEl.style.fontsize= "48px"

            nodeEl.renderOrder = 1;
            nodeEl.textContent = node.statement
            nodeEl.className = 'statement_node';
            nodeEl.style.color = node.color;

            if (node.intra_id === origin_node.intra_id){

                nodeEl.style.color = 'rgb(121,64,60)'

            }
            else if (node.tag=== 'key_element'){
                nodeEl.style.color = 'rgb(238,199,109)'

            }
            else {
                nodeEl.style.color = 'rgb(90,151,162)'

            }

            return new CSS2DObject(nodeEl);

            // const sprite = new SpriteText(node.statement);
            // sprite.material.depthWrite = false;
            // sprite.color = 'lightsteelblue';
            //
            // if (node.id === origin_node){
            //   sprite.color = '#D09541'
            //     addInfoCard(node)
            // }
            // else if (node.tag=== 'key_element'){
            //    sprite.color = "#F3F3F3"
            //
            // }
            // else {
            //     sprite.color = "#4C70AC"
            //     //nodeEl.style.opacity = 0.45;
            //     addInfoCard(node)
            //
            // }
            // sprite.textHeight = 6;
            // return sprite;
            //
            // return new CSS2DObject(nodeEl);
        })
        .nodeColor(node=>{
            if (node.id === origin_node){

                return 'rgb(206,86,66)'

            }
            else if (node.tag=== 'key_element'){
                return 'rgb(238,199,109)'

            }
            else {
                return 'rgb(90,151,162)'

            }
        })
        .onNodeDragEnd(node => {
            node.fx = node.x;
            node.fy = node.y;
            node.fz = node.z;
        })
        .linkWidth(1)
        .width(1000)
        // .onNodeClick(node => click_node(node))
        .cooldownTicks(10)
        // .linkDirectionalParticles("value")
        // .linkDirectionalParticleSpeed(d =>  d.value * 0.001)
        .nodeThreeObjectExtend(true)
    var k = 0
    Graph.d3Force('charge').strength(-250);
    Graph.onEngineStop(() => {
        if (k === 0) {
            k = 1
            Graph.zoomToFit(250)
            Graph.cameraPosition(
                { x:0, y:100, z: 200 },  // new position
                { x: 0, y: 0, z: 0 },  // look-at position
                1000  // transition duration
            );
        }

    });


}

window.updatePannel = function(data) {
    console.log("All results from search")
    console.log(data)
    all_results = data["all_results"]
    keywords = data["keywords"]

    if(all_results.length >= 1) {
        $('#add_statement_div').css('display', 'none');
        btn1.style.display = 'none';
        var keywords_html = get_keywords_html(data["keywords"])
        var related_statements_html = get_related_statements(data)
        var insertedStatement = $('#add_statement_div input').val();

        let ss;
        ss = `
                   <div class="form-group row mt-4 justify-content-left" id="descriptions">
                    <div>
                        <p style="font-size:15px">
                            <b>Hey there! 👋 Welcome to Mindbugs Discovery.</b><br><br>
                            Let's dive right in! For the statement you provided: <i>"` + insertedStatement + `"</i> here's what we discovered: 
                        </p>        
                    </div>
                   
                        <div class="col-12 mb-3"><label style="font-size:15px" >First we found this <b>Keywords:</b></label>
                           ` + keywords_html + `
                        </div>
                        <div class="col-12 mb-3"><label style="font-size:15px" >The proposed tag is</label>
                           <span class="badge badge-success ml-2 mb-2" style="font-size:15px"> War propaganda </span>
                        </div>
                        <br>
                        
                        <div class="col-12 text-wrap rounded" style="background-color: #e5e5e5; padding-top: 20px; padding-bottom: 20px;">
                            <div class="d-flex align-items-center">
                                <label class="flex-grow-1" style="font-size:15px">Based on these keywords, our analysis revealed the following <b>related statements</b>:</label>
                                <a class="btn btn-link btn-sm ml-auto" data-toggle="collapse" href="#collapseRelatedStatement" role="button" aria-expanded="false">
                                    <i style="font-size: 20px" class="bi bi-arrow-down-up"></i>
                                </a>
                            </div>
                            ` + related_statements_html + `
                        </div>
                        
                        <div class="col-12 ">
                            <label style="font-size:12px; color:red"> *If a statement isn't quite right, click 'x' to remove it. <br> <span style="color: darkgreen">*Found one you want to include? Click '+' to add it.</span></label>
                        </div>
                        
                        <h3><b>Statistics</b></h3>
                        <div class="col-12 text-wrap rounded" style="background-color: #e5e5e5; padding-top: 10px; padding-bottom: 10px;">
                            <label class="flex-grow-1" style="font-size:15px">Check out the <b>channels</b> where this information was propagated:</label>
                            <a class="btn btn-link btn-sm ml-auto" data-toggle="collapse" href="#collapseChanels" role="button" aria-expanded="false">
                                <i style="font-size: 20px" class="bi bi-arrow-down-up"></i>
                            </a>
                            <div class="collapse show" id="collapseChanels"> <!--Aici am lasat show ca sa il inchidem din js ca sa se randeze graficul corect ca si dimensiuni-->
                                <div id="plotly-div2" style="min-height: 200px"></div>
                            </div>
                        </div>
                        
                        <div class="col-12 text-wrap rounded" style="background-color: #e5e5e5; padding-top: 10px; padding-bottom: 10px;">
                            <label class="flex-grow-1" style="font-size:15px">Check out the timeline for your statements:</label>
                            <a class="btn btn-link btn-sm ml-auto" data-toggle="collapse" href="#collapseTimeline" role="button" aria-expanded="false">
                                <i style="font-size: 20px" class="bi bi-arrow-down-up"></i>
                            </a>
                            <div class="collapse show" id="collapseTimeline"> 
                                <div id="visualization"></div>
                            </div>
                        </div>
                        
                        <div class="col-12 text-wrap rounded" style="background-color: #e5e5e5; padding-top: 10px; padding-bottom: 10px;">
                            <label class="flex-grow-1" style="font-size:15px">See the <b>countries</b> where this narrative appeared.:</label>
                            <a class="btn btn-link btn-sm ml-auto" data-toggle="collapse" href="#collapseCountry" role="button" aria-expanded="false">
                                <i style="font-size: 20px" class="bi bi-arrow-down-up"></i>
                            </a>
                            <div class="collapse show" id="collapseCountry"> <!--Aici am lasat show ca sa il inchidem din js ca sa se randeze graficul corect ca si dimensiuni-->
                                <div id="plotly-div" style="min-height: 200px"></div>
                            </div>
                        </div>
                     
                    </div>
                    `

        card_body.style.height = "100%"
        card_body.insertAdjacentHTML('beforeend', ss);
        inject_countries_barchart(data)
        inject_sources_barchart(data)
        inject_timeline_chart(data)
        updateGraphAnalyze(data)
    }
    else {
        var no_results_html = `<span id="noresults" class="badge badge-warning mt-2 mb-2" style="font-size:15px"> ** No results found. Please try with another input </span>`
        var existingElement = document.getElementById("noresults");
        if (existingElement) {
            existingElement.remove();
        }
        card_body.insertAdjacentHTML('beforeend', no_results_html);
    }

}

var btn1, card_body

function openPanel() {
    const p = document.createElement("div")
    p.id = "add"
    p.classList.add("card",  "info-bar", "mt-1")
    p.style.direction="ltr"
    card_body = document.createElement("div")
    const card_body_add_statement = document.createElement("div")
    card_body_add_statement.id = "add_statement_div"
    card_body.classList.add("card-body")
    const h2 = document.createElement("h3")
    h2.classList.add("card-title")
    h2.appendChild(document.createTextNode("Submit a New Statement for Analysis and Assistance"))
    const pp2 = document.createElement("h5")
    pp2.classList.add("card-subtitle","mb-2","text-muted", "mt-1")
    const input1 = document.createElement("input")
    input1.classList.add("form-control")
    input1.value = "EU wants to push Romania to enter war with Russia"
    const close = document.createElement("span")
    close.classList.add('pull-right','clickable', 'close-icon')
    close.onclick = function() {

        let card = $(this).closest('.card')
        //remove_node_id(card[0].id)

        $(this).closest('.card').fadeOut();
    }

    const ifa_close = document.createElement("i")
    ifa_close.classList.add('fa','fa-times')
    close.appendChild(ifa_close)
    card_body.appendChild(close)
    card_body.appendChild(card_body_add_statement);
    btn1 = document.createElement("button")
    btn1.classList.add("btn","btn-primary", "mt-2")
    btn1.textContent="Analyze"

    btn1.onclick = function () {
        $(".loading-overlay").show();
        var payload = {
            "statement": input1.value
        }
        $.ajax({
            type: 'POST',
            url: 'https://mindbugs.go.ro/analyze2',
            // url: 'http://localhost/eufacts4/public/GraphJson/mihai_data_small.json',
            data: JSON.stringify(payload),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (data){
                updatePannel(data)
            },
            complete: function () {
                $(".loading-overlay").hide();
            }
        })
    }

    let divOverlayLoading = '<div class="loading-overlay">' +
        '<div class="loading-spinner"></div>' +
        '<p class="loading-message">Processing data...</p>' +
        '</div>'
    card_body_add_statement.appendChild(h2)
    //card_body.appendChild(badge_row2)
    card_body_add_statement.appendChild(pp2)
    card_body_add_statement.appendChild(input1)
    card_body_add_statement.appendChild(btn1)
    card_body.insertAdjacentHTML('beforeend', divOverlayLoading);
    //card_body.appendChild(pp)
    //card_body.appendChild(ahref)
    p.appendChild(card_body)

    const element = document.getElementById("container");

    element.insertBefore(p, element.firstChild)

    p.classList.add('show');
    element.classList.add('show')

}

document.getElementById ("btnAddStatement").addEventListener ("click", openPanel, false);
$(document).ready(function() {
    // Așteaptă încărcarea completă a paginii
    $(window).on('load', function() {
        openPanel()
    });
});

