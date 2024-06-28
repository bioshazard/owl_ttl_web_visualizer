function insert_languages(){
    var container = document.getElementById("languages-container");
    var html = '';
    var colorIndex = 0;

    for (var lang in all_languages) {
        var color = all_languages_colors[colorIndex  % all_languages_colors.length ];

        //console.log(all_languages)
        //console.log(all_languages['lang'])
        var narratives = all_languages[lang].narratives.map((narrative, index) => {
            let nn = narrative.replace(/"/g, '')
            return (index + 1) + '.  ' + nn; // Adds an index starting from 1 before each narrative
        }).join("<br/>"); // Joins all indexed narratives with a newline separator

        var counter = all_languages[lang].counter;

        html += ' <div type="button" className="p-1 ml-3" style="margin-right:20px" data-bs-html="true"' +
            ' data-bs-toggle="popover"  data-bs-dismiss="true" data-bs-placement="top" ' +
            'data-bs-content="'+ narratives + '">';
        html += '<span class="fs-4 d-inline-block mb-2 fw-semibold text-gray-600 me-2 text-capitalize" style="text-decoration-line: underline; color: ' + color + ';">' + lang + '</span>';
        html += '<span class="badge fs-7 text-white" style="background-color: '+ color + '">' + counter + '</span>';
        html += '</div>';

        // Increment color index and reset if it reaches the length of the color array
        colorIndex = colorIndex + 1;
    }
    if (html === '')
        html += '<span class="fs-6 d-inline-block mb-2  text-gray-500 me-2" >' + 'No entries' + '</span>';

    container.innerHTML = html;
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Popover(tooltipTriggerEl);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    insert_languages()
});


window.insert_languages = insert_languages;