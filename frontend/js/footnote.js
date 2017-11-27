$(document).ready(function(){
    var footnotes = $('.footnote');
    var refs = $('.footref');
    
    for (i = 0; i < footnotes.length; i++) {
        console.log(refs.length);
        var id = footnotes[i].dataset.footnote;
        var ref;
        var self;
        refs.each(function() {
            self = $(this);
            if (self.data("footref") == id) {
                ref = self[0];
                return false;
            }
        });
        refs = refs.not(self);
        console.log(footnotes[i].innerText + ' has the footnote reference number ' + ref.innerText);
    }
});