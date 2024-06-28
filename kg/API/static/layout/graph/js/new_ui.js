"use strict";
// Class definition
var timeline
var items
var groups

function insert_css(name, value){
    const newClass = document.createElement('style');
    newClass.type = 'text/css';
    newClass.innerHTML = '.' + name + `{`+ value + `}`;

// Append the new class to the head of the document
    document.head.appendChild(newClass);
}

function get_truncated_content(my_str){
    let limit = 70
    return my_str.length > limit ? my_str.substring(0, limit) + '...' : my_str
}


function updateTimelineData() {
    //console.log("Update timeline data")
    if (timeline) {
        var parsed_items = []
        var index = 1
        // console.log(all_results)
        for(var data_index in all_results){
            var data_element = all_results[data_index]
            if(data_element['selected'] === 0 || data_element['countries'].length === 0)
            {
                continue;
            }

            for (var location_index in data_element['countries']) {
                //var location = data_element['countries'][location_index]['name']
                var color = data_element['countries'][location_index]['color']
                var col_class = "col-" + color.substring(1)
                var new_element = {
                    'id': index,
                    'group': data_element['countries'][location_index]['id'],
                    'start': moment(data_element['date'], "DD.MM.YYYY"),
                    'color': color,
                    'content': data_element['statement'],
                    'className': col_class
                }
                // insert_css("vis-item.vis-line." + col_class, "opacity:" + 0 + ";")
                // insert_css("vis-item.vis-dot." + col_class, "border-color:" + color + ";")
                insert_css("vis-item.vis-line." + col_class, "border-color:" + color + ";")
                insert_css("vis-item.vis-dot." + col_class, "border-color:" + color + ";")
                index = index + 1;
                parsed_items.push(new_element)

            }

        }
        //insert_css("col-467A67", "border-color:#467A67;")

        items = new vis.DataSet(parsed_items)
        timeline.setItems(items);
        groups = new vis.DataSet(colorData2)
        timeline.setGroups(groups);
        timeline.fit();
        initializeTooltips();
    }
}
var KTTimelineWidget4 = function () {
    // Private methods

    // 2022 timeline
    //console.log("entering timeline")
    const initTimeline2022 = () => {
        // Detect element
        const element = document.querySelector('#kt_timeline_widget_4_4c');
        if (!element) {
            return;
        }

        if(element.innerHTML){
            return;
        }

        // Set variables
        var now = Date.now();
        console.log(colorData2)
        console.log(colorData2)
        groups = new vis.DataSet(colorData2)
        var parsed_items = []
        var index = 1
        // console.log("Entering for")
        // console.log('COLOR DATA')
        // console.log(colorData)

        // let filteredResults = all_results.filter(data_element => {
        //     return data_element['selected'] === 1 && data_element['countries'].length !== 0;
        // });

        // Sort the filtered results by date in "DD.MM.YYYY" format



        for(var data_index in all_results){
            //console.log(data_index)
            var data_element = all_results[data_index]
            //console.log(data_element)
            if(data_element['selected'] === 0 || data_element['countries'].length === 0)
            {
                continue;
            }
           // console.log(data_element['countries'])
            for (var location_index in data_element['countries']) {
                //var location = data_element['countries'][location_index]['name']
                var color = data_element['countries'][location_index]['color']
                var col_class = "col-" + color.substring(1)
                var new_element = {
                    'id': index,
                    'group': data_element['countries'][location_index]['id'],
                    'start': moment(data_element['date'], "DD.MM.YYYY"),
                    'color': color,
                    'content': data_element['statement'].replace(/"/g, ''),
                    'className': col_class,
                    //'align':'right',
                    //'type': 'point'
                }
                //insert_css("vis-item.vis-line." + col_class, "border-width:0px" )
                //insert_css("vis-item.vis-dot." + col_class, "border-width:0px")
                //insert_css("vis-item.vis-dot." + col_class, "border-color:" + color + ";")

                insert_css("vis-item.vis-line." + col_class, "border-color:" + color + ";")
                insert_css("vis-item.vis-dot." + col_class, "border-color:" + color + ";")
                index = index + 1;
                parsed_items.push(new_element)

            }


        }

        // parsed_items = parsed_items.sort(function(a, b) {
        //     return b.start - a.start; // Assuming 'start' is a Moment.js object
        // });

        //console.log("PARSED ITEMS")
        //console.log(parsed_items)

        items = new vis.DataSet(parsed_items)

        // var items = new vis.DataSet([
        //     {
        //         id: 1,
        //         group: 'Russia',
        //         start: moment("27.05.2023", "DD.MM.YYYY"),
        //         content: "Ukraine is a Soviet invention",
        //         //color: 'primary',
        //         color: '#333DA8',
        //     },
        //     {
        //         id: 11,
        //         group: 'Russia',
        //         start: moment("07.07.2021", "DD.MM.YYYY"),
        //         content: "Ukraine does not exist, it is part of Russia",
        //         //color: 'primary',
        //         color: '#333DA8',
        //     },
        // ]);

        // Set vis-timeline options
        var options = {
            zoomable: false,
            moveable: true,
            selectable: false,
            // More options https://visjs.github.io/vis-timeline/docs/timeline/#Configuration_Options
            margin: {
                item: {
                    horizontal:15,
                    vertical: 11
                },
                axis: 20
            },
            //timeAxis: {scale: 'month', step: 12},

            // Remove current time line --- more info: https://visjs.github.io/vis-timeline/docs/timeline/#Configuration_Options
            showCurrentTime: false,
            showTooltips: true,
            verticalScroll: true,
            //maxHeight:"500px",

            // Whitelist specified tags and attributes from template --- more info: https://visjs.github.io/vis-timeline/docs/timeline/#Configuration_Options
            xss: {
                disabled: false,
                filterOptions: {
                    whiteList: {
                        div: ['class', 'style', 'data-bs-toggle', 'data-bs-placement', 'title', 'type'],
                        span: ['class'],
                        br: ['style']

                    },
                },
            },
            // specify a template for the items
            template: function (item) {
                let userTemplate = '';
                // let ii = moment(item.start)
                // console.log(ii.format("DD MMMM YYYY"))
                let truncatedContent =  get_truncated_content(item.content);
                // return `<div class="d-flex align-items-center position-relative overflow-hidden"
                //              style="background-color: ${item.color}; border-radius: 50%; width:10px; height:10px"
                //              type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.content}"
                //              ></div>`
                return `<div class="rounded-pill d-flex align-items-center position-relative h-20px ps-4 pe-4 pt-2 pb-2 overflow-hidden"
                            style="background-color: ${item.color}; border-radius: 5px"
                            type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.content}"
                            >

<!--                    <div class="d-flex align-items-center position-relative z-index-2">-->
                        <div class="fw-bold text-white text-hover-light fs-10px w-100 text-start">${truncatedContent}  </div>

                        <div class="fw-normal text-white text-hover-light fs-5px pl-1" style="font-size: 10px; padding-left: 10px">
                            ${moment(item.start).format("DD MMMM YYYY")}
                           </div>
<!--                    </div>-->
                </div>
                `;
            },

            groupTemplate: function (item) {
                let userTemplate = '';

                return `<div class="rounded-pill d-flex align-items-center position-relative h-20px w-100 p-2 px-5 overflow-hidden" style="color: ${item.color}">

                    <div class="d-flex align-items-center position-relative z-index-2">
                        <span class="fw-bold fs-10px" >${item.name}</span>
                    </div>
                </div>
                `;
            },

            // Remove block ui on initial draw
            onInitialDrawComplete: function () {

                const target = element.closest('[data-kt-timeline-widget-4-blockui="true"]');
                const blockUI = KTBlockUI.getInstance(target);

                if (blockUI.isBlocked()) {
                    setTimeout(() => {
                        blockUI.release();
                    }, 100);
                }
            }
        };

        // Init vis-timeline
        timeline = new vis.Timeline(element, items, groups, options);
        //timeline = new vis.Timeline(element, items, options);
        // Prevent infinite loop draws
        timeline.on("currentTimeTick", () => {
            // After fired the first time we un-subscribed
            timeline.off("currentTimeTick");
        });
    }
    // Handle BlockUI
    const handleBlockUI = () => {
        // Select block ui elements
        const elements = document.querySelectorAll('[data-kt-timeline-widget-4-blockui="true"]');

        // Init block ui
        elements.forEach(element => {
            const blockUI = new KTBlockUI(element, {
                overlayClass: "bg-body",
            });

            blockUI.block();
        });
    }
    //initTimeline2022();


    // Public methods
    return {
        init: function () {
            // console.log("Initi timeline")
            initTimeline2022();
            handleBlockUI();
            initializeTooltips();

        }
    }
}();

// Webpack support
if (typeof module !== 'undefined') {
    module.exports = KTTimelineWidget4;
}

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTTimelineWidget4.init();
});

$(document).ready(function() { $('[data-bs-toggle="tooltip"]').tooltip(); });

window.updateTimelineData = updateTimelineData;
