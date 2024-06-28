$("#btnShowFilter").click(function () {
    $("#filterCard").css('display', 'block');
});
$("#hideFilterCard").click(function () {
    $("#filterCard").css('display', 'none');
});

$(document).ready(function () {
    // Inițializează datepicker pentru cele două input-uri
    $('#startDate, #endDate').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true
    });

    $('#clearStartDate').on('click', function () {
        $('#startDate').val('');
    });

    $('#clearEndDate').on('click', function () {
        $('#endDate').val('');
    });
});