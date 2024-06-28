window.addStatement = function (intra_id) {
    event.preventDefault()
    $.ajax({
        type: 'POST',
        url: 'https://mindbugs.go.ro/addStatement',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({
            intra_id: intra_id,
            all_results: all_results,
            origin: all_data['origin'][0],
            keywords: all_data['keywords']
        }),
        success: function(data) {
            console.log("add statement result")
            console.log(data);
            updateGraphAnalyze(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error:', errorThrown);
        }
    });
}

window.removeStatement = function (intra_id) {
    console.log("REMOVE STATEMENT")
    event.preventDefault()
    $.ajax({
        type: 'POST',
        url: 'https://mindbugs.go.ro/removeStatement',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({
            intra_id: intra_id,
            all_results: all_results,
            origin: all_data['origin'][0],
            keywords: all_data['keywords']
        }),
        success: function(data) {
            console.log("add statement result")
            console.log(data);
            updateGraphAnalyze(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error:', errorThrown);
        }
    });
}
function ucwords(str) {
    return str.toLowerCase().replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}

function initializeTooltips() {
    // Find all elements with the data-bs-toggle="popover" attribute
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

    // Initialize popovers for each element
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Tooltip(popoverTriggerEl);
    });
}
function updateResults(allResults){
    allResults.forEach(function(element) {
        // Create a new div element
        var div = document.createElement('div');
        div.classList.add('d-flex', 'flex-stack', 'align-items-start', 'mt-3');

        var innerDiv = document.createElement('div');
        innerDiv.classList.add('d-flex', 'align-items-left', 'me-5');

        var span = document.createElement('span');
        span.classList.add('badge', 'badge-outline');
        if (element.selected == 1) {
            span.classList.add('selected-statement');
        } else {
            span.classList.add('unselected-statement');
        }
        span.id = 'statement-span-' + element.intra_id;

        var icon = document.createElement('i');
        icon.classList.add('bi', 'bi-info-circle', 'me-2');
        icon.setAttribute('style', 'font-size: 17px');
        icon.setAttribute('data-bs-toggle', 'tooltip');
        icon.setAttribute('data-bs-html', 'true');
        icon.setAttribute('title', '<b>Date:</b> ' + element.date + '<br/><b>Locations:</b> ' + (element.countries && element.countries.length > 0 ? element.countries.map(function(country) {
            return ucwords(country.name);
        }).join(', ') : '<em>no data</em>') + '<br/><b>Languages:</b> ' + (element.languages && element.languages.length > 0 ? element.languages.map(function(language) {
            return ucwords(language);
        }).join(', ') : '<em>no data</em>') + '<br/><b>Channels:</b><br/>' + (element.channel && element.channel.length > 0 ? element.channel.join(',<br/>') : '<em>no data</em>'));

        var anchor = document.createElement('a');
        anchor.setAttribute('href', element.url);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('title', 'Read the original article');
        anchor.classList.add('symbol-label', 'me-1');

        var symbolDiv = document.createElement('div');
        symbolDiv.classList.add('symbol', 'symbol-20px', 'me-2');

        var img = document.createElement('img');
        img.setAttribute('src', base_url + '/public/layout/logo/icon_source.png');
        img.setAttribute('style', 'width: 20px; height: auto');
        img.setAttribute('alt', '');

        symbolDiv.appendChild(img);
        anchor.appendChild(symbolDiv);
        //icon.appendChild(anchor);

        var statementDiv = document.createElement('div');
        statementDiv.classList.add('fw-bold', 'fs-6', 'text-start');
        statementDiv.setAttribute('style', 'max-width: 100%; white-space: normal;');
        statementDiv.textContent = element.statement;

        span.appendChild(icon);
        span.appendChild(anchor);
        span.appendChild(statementDiv);
        innerDiv.appendChild(span);
        div.appendChild(innerDiv);

        var parentDiv = document.getElementById('search-card');
        parentDiv.appendChild(div);

        // Add onclick event to the statement div
        statementDiv.onclick = function() {
            toggleStatementSelection(element.intra_id);
        };
    });
    initializePopovers();

}

function recomputeLanguages(oldDict, newDict){

    var mergedDict = {};

    // Iterate over the keys of the old dictionary
    for (var key in oldDict) {
        if (oldDict.hasOwnProperty(key)) {
            // Check if the key exists in the new dictionary
            if (newDict.hasOwnProperty(key)) {
                // If the key exists in both dictionaries, merge their values
                mergedDict[key] = {
                    counter: oldDict[key].counter + newDict[key].counter,
                    narratives: oldDict[key].narratives.concat(newDict[key].narratives)
                };
            } else {
                // If the key only exists in the old dictionary, add it to the merged dictionary
                mergedDict[key] = oldDict[key];
            }
        }
    }

    // Iterate over the keys of the new dictionary
    for (var key in newDict) {
        if (newDict.hasOwnProperty(key) && !mergedDict.hasOwnProperty(key)) {
            // If the key only exists in the new dictionary, add it to the merged dictionary
            mergedDict[key] = newDict[key];
        }
    }

    return mergedDict;

}

window.loadMore = function(){
    console.log("LOAD MORE")
    showLoadPageMoreResults()
    event.preventDefault()
    $.ajax({
        type: 'POST',
        //url: 'http://127.0.0.1:5005/load_more',
        url: 'https://mindbugs.go.ro/load_more',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({
            statement: query,
            skip: nr_res['total'],
        }),
        success: function(data) {
            // console.log("load more result")
            // console.log(JSON.stringify({
            //     data: data,
            // }));
            $.ajax({
                type: 'POST',
                //url: 'https://mindbugs.go.ro/removeStatement',
                url: base_url + "/graph/graph/parsedataajax",
                dataType: 'json',
                data: {data: data},
                success: function (data) {
                    // console.log("load more result 2")
                    // console.log(data);
                    try {
                        console.log(all_results)
                        all_results = all_results.concat(data['all_results'])
                        all_languages = recomputeLanguages(all_languages, data['all_languages'])
                        console.log(all_languages)
                        window.insert_languages()
                        colorData2 = colorData2.concat(data['all_countries_colors'])
                        nr_res['total'] = nr_res['total'] + data['nr_res']['total']
                        nr_res['selected'] = nr_res['selected'] + data['nr_res']['selected']
                        updateSelectedNumber()
                        updateTotalNumber()
                        updateChannelsTable()
                        updateResults(data['all_results'])
                        //console.log(all_results)
                        window.updateTimelineData();
                        updateCountriesChart(-1);
                        updateMapChart(-1)
                        hideLoadingPage()
                    }
                    catch (error){
                        console.log("ERROR : " + error)
                        hideLoadingPage()
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Error:', errorThrown);
                    hideLoadingPage()
                }
            });
            //updateGraphAnalyze(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error:', errorThrown);
        }
    });
}