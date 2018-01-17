// Sorts exercise table alphabetically
function SortTableAlphabetically(table, reverse) {
    
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
        let A = new Date(aDate[2], aDate[1] - 1, aDate[0], aDate[3], aDate[4]);
        let B = new Date(bDate[2], bDate[1] - 1, bDate[0], bDate[3], bDate[4]);
        
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

// Searches and sorts table by query
function SearchTable(query) {
    
    // Changes query to full uppercase
    query = query.toUpperCase();
    
    // Gets all table rows in table
    const tableRow = $('#tableContainer table tbody tr');
    
    // Variable to check if row is shown
    // Used for breaking loop
    let isShown = false;
    
    // Loop through all rows
    for (i = 0; i < tableRow.length; i++) {
        
        // Get all table data in row
        let tableData = tableRow[i].getElementsByTagName('td');
        isShown = false;
        
        // Loop through all table data
        for (j = 0; j < tableData.length; j++) {
            
            if (isShown == false) {
                
                // Checks if any of the table data cells contain the query substring
                if (tableData[j].innerHTML.toUpperCase().indexOf(query) > -1) {
                    tableRow[i].style.display = "table-row";
                    isShown = true;
                } else {
                    tableRow[i].style.display = "none";
                }
                
            }
            
        }
        
    }
    
    const visTr = $('tr:visible');
    visTr.filter(':odd').css('background-color', '#ddd');
    visTr.filter(':even').css('background-color', '#f1f1f129');
}

function ResetFa() {
    
    let asc = $('.fa-sort-asc');
    let desc = $('.fa-sort-desc');
    
    asc.addClass('fa-sort');
    desc.addClass('fa-sort');
    
    $('.fa-sort').removeClass('fa-sort-asc fa-sort-desc');
    
}

$(document).ready(function() {
    
    $('th').click(function() {
        
        let element = $(this);
        let fa = element.children('i');
        let className = element.attr('class');
        let isDate = element.hasClass('tDate');
        
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
    
    $('#inputContainer input').keyup(function() {
        
        SearchTable( $('#inputContainer input').val() );
        
    });
    
});