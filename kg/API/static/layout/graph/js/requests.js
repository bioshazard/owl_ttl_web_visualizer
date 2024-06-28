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
            origin: origin_node,
            keywords: keywords
        }),
        success: function(data) {
            console.log("add statement result")
            console.log(data);
            let element = document.getElementById("descriptions")
            if (element)
                element.remove()
            updatePannel(data)
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
            origin: origin_node,
            keywords: keywords
        }),
        success: function(data) {
            console.log("add statement result")
            console.log(data);
            let element = document.getElementById("descriptions")
            if (element)
                element.remove()
            updatePannel(data)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error:', errorThrown);
        }
    });
}