// Sorts exercise table alphabetically
function SortTableAlphabetically(table, reverse){
    
    table = '.' + table;
    
    // Gets relevant rows from the table
    let rows = $('#tableContainer table tbody tr').get();
    
    // Sorts array alphabetically
    rows.sort(function(a, b) {
    
    let A = $(a).children(table).eq(0).text().toUpperCase();
    let B = $(b).children(table).eq(0).text().toUpperCase();
    
    if(A < B) {
        return -1;
    }
    
    if(A > B) {
        return 1;
    }
    
    return 0;
    
    });
    
    // Reverses array order if desired
    if (reverse) {
        rows.reverse();
    }
    
    // Re-inserts the ordered rows back into the table
    $.each(rows, function(index, row) {
        
        $('#tableContainer table').children('tbody').append(row);
        
    });
    
}

// Sorts exercise table by date
function SortTableDate(reverse) {
    
    // Gets relevant rows from the table
    let rows = $('#tableContainer table tbody tr').get();
    
    // Sorts table by date (newest first)
    rows.sort(function(a, b) {
        
        // Splits the date string at each character that's not a number
        let aDate = $(a).children('.tDate').text().match(/\d+/g);
        let bDate = $(b).children('.tDate').text().match(/\d+/g);
        
        // Creates new date objects based on the numbers from the string
        let A = new Date(aDate[0], aDate[1], aDate[2], aDate[3], aDate[4]);
        let B = new Date(bDate[0], bDate[1], bDate[2], bDate[3], bDate[4]);
        
        return B - A;
        
    });
    
    // Reverses array order if desired
    if (reverse) {
        rows.reverse();
    }
    
    // Re-inserts the ordered rows back into the table
    $.each(rows, function(index, row){
        
        $('#tableContainer table').children('tbody').append(row);
        
    });
    
}

function ResetFa() {
    
    let asc = $('.fa-sort-asc');
    let desc = $('.fa-sort-desc');
    
    asc.addClass('fa-sort');
    desc.addClass('fa-sort');
    
    $('.fa-sort').removeClass('fa-sort-asc fa-sort-desc');
    
}

$(document).ready(function() {
    
    SortTableDate(false);
    
    $('th').click(function() {
        
        let element = $(this);
        let fa = element.children('i');
        let className = element.attr('class');
        let isDate = element.hasClass('.tDate');
        
        if (isDate) {
            
            if (fa.hasClass('fa-sort') || fa.hasClass('fa-sort-asc')) {
                
                SortTableDate(false);
                ResetFa();
                fa.removeClass('fa-sort');
                fa.addClass('fa-sort-desc');
                
            } else {
                
                SortTableDate(true);
                ResetFa();
                fa.removeClass('fa-sort');
                fa.addClass('fa-sort-asc');
                
            }
            
        } else if (!isDate) {
            
            if (fa.hasClass('fa-sort') || fa.hasClass('fa-sort-asc')) {
                
                SortTableAlphabetically(className, false);
                ResetFa();
                fa.removeClass('fa-sort');
                fa.addClass('fa-sort-desc');
                
            } else {
                
                SortTableAlphabetically(className, true);
                ResetFa();
                fa.removeClass('fa-sort');
                fa.addClass('fa-sort-asc');
                
            }
            
        }
        
    });
    
    $('.dropdown').hover(function() {
        $('.dropdownMenu').slideDown(200);
    }, function() {
        $('.dropdownMenu').slideUp(200);
    });
    
});
