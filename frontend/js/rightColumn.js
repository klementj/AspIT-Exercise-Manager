$(document).ready(function(){
    /*Variables for positioning right column's footnotes and images in line with their corresponding references and image anchors in the left column*/
    var anchors = $('.img-anchor');
    var imgs = $('.right-img');
    var refs = $('.footref');
    var notes = $('.footnote');
    
    /*Loop through each image anchor in left column*/
    anchors.each(function(index, value) {
        var anchor = value;
        var img;
        var id = anchor.dataset.imgAnchor;
        
        /*Loop through each image in the right column*/
        imgs.each(function(index, value) {
            img = value;
            
            /*If current image matches the anchor id, break loop by returning false*/
            if (img.dataset.img == id) {
                return false;
            }
        });
        
        /*Remove image from future iterations*/
        imgs = imgs.not(img);
        
        /*Find position of the anchor and apply it to the image*/
        var pos = $('.img-anchor').eq(index).position().top;
        $('.right-img').eq(index).css( "top", pos );
    });
    
    /*Loop through each reference number in left column*/
    refs.each(function(index, value) {
        var ref = value;
        var note;
        var id = ref.dataset.footref;
        
        /*Loop through each footnote in right column*/
        notes.each(function(index, value) {
            note = value;
            
            /*If current footnote matches the reference id, break loop by returning false*/
            if (note.dataset.footnote == id) {
                return false;
            }
        });
        
        /*Remove note from future iterations*/
        notes.not(note);
        
        /*Find position of the reference (requires some finetuning due to <sup>'s size and position) and apply it to the footnote*/
        var pos = $('.footref').eq(index).position().top - $('.footref').eq(index).height() * 1.5 - 2;
        $('.footnote').eq(index).css( "top", pos);
    })
    
    /**/
    /*Class and function declarations for positioning of right column elements relative to each other*/
    /**/
    
    /*Class for indicating vertical space taken up by elements*/
    class Block {
        constructor(start, end) {
            this.start = start;
            this.end = end;
        }

        overlaps(block) {
            if (this.start <= block.start && this.end >= block.start) { return true; }
            if (this.start <= block.end && this.end >= block.end) { return true; }
            if (block.start <= this.start && block.end >= this.start) { return true; }
            else { return false; }
        }
    }
    
    /*Define array of spaces taken up by right column elements*/
    var bigImgBlocks = Array();
    var rightImgBlocks = Array();
    var footnoteBlocks = Array();

    /*Get the space taken up by each big-img and push to array*/
    function()
    $('.big-img').each(function(index, value) {
        /*Declare block*/
        var start = $('.big-img').eq(index).position().top;
        var end = $('.big-img').eq(index).height() + start;
        var bigImgBlock = new Block(start, end);

        /*Push to array*/
        bigImgBlocks.push( bigImgBlock );
    })

    /*Get the space taken up by each right-img, check for overlap with big-imgs, reposition if necessary, and push to array*/
    function RightImgByBigImg() {
        $('.right-img').each(function(index, value) {
            /*Declare block*/
            var start = $('.right-img').eq(index).position().top;
            var end = $('.right-img').eq(index).height() + start;
            var rightImgBlock = new Block(start, end);
            var changes = false;

            /*Foreach big-img, check if current right-img overlaps. If true, move right-img past big-img and redeclare its block*/
            for (i = 0; i < bigImgBlocks.length; i++) {
                if (bigImgBlocks[i].overlaps(rightImgBlock)) {
                    var pos = bigImgBlocks[i].end;
                    $('.right-img').eq(index).css( "top", pos );

                    start = $('.right-img').eq(index).position().top;
                    end = $('.right-img').eq(index).height() + start;
                    rightImgBlock = new Block(start, end);
                    changes = true;
                }
            }

            /*Push to array*/
            rightImgBlocks.push( rightImgBlock );
        });
    }
    
    /*Foreach right-img, check for overlap with other right-imgs and reposition if necessary*/
    function RightImgByRightImg() {
        $('.right-img').each(function(index, value) {
            if (index > 0) {
                /*Declare block*/
                var start = $('.right-img').eq(index).position().top;
                var end = $('.right-img').eq(index).height() + start;
                var rightImgBlock = new Block(start, end);
                var changes = false;
                var currentImgPos = $('.right-img').eq(index).position().top;
                var previousImgBottom = $('.right-img').eq(index - 1).position().top + $('.right-img').eq(i - 1).css("height");
            
                if (currentImgPos < previousImgBottom) {
                    $('.right-img').eq(index).css( "top", previousImgBottom );

                    start = $('.right-img').eq(index).position().top;
                    end = $('.right-img').eq(index).height() + start;
                    rightImgBlock = new Block(start, end);
                    changes = true;
                }
            }
        }
        /*For each image, check if the previous image overlaps and */
        for (i = 1; i < $('.right-img').length; i++) {
            var currentImgPos = $('.right-img').eq(i).position().top;
            var previousImgBottom = $('.right-img').eq(i - 1).position().top + $('.right-img').eq(i - 1).css("height");
            
            if (currentImgPos < previousImgBottom) {
                $('.right-img').eq(i).css( "top", previousImgBottom );
                changes = true;
            }
        }
        
        if (changes) {
            RightImgByBigImg();
        }
    }

    /*Get the space taken up by each footnote and push to array*/
    $('.footnote').each(function(index, value) {
        var start = $('.footnote').eq(index).position().top;
        var end = $('.footnote').eq(index).height() + start;
        var footnoteBlock = new Block(start, end);

        rightImgBlocks.forEach(function(block) {
            if (block.overlaps(footnoteBlock)) {
                var pos = block.end;
                $('.footnote').eq(index).css( "top", pos );

                start = $('.footnote').eq(index).position().top;
                end = $('.footnote').eq(index).height() + start;
                footnoteBlock = new Block(start, end);
            }
        })

        footnoteBlocks.push( footnoteBlock );
    });
    
    /**/
    /**/
    /**/
    
    $(window).on("load", function() {
        
        
        
        console.log(rightImgBlocks);
        console.log(footnoteBlocks);
    });
});